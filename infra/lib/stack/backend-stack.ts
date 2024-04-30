import * as cdk from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { makeRecordsToALB } from '../service/route53'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as log from 'aws-cdk-lib/aws-logs'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { RemovalPolicy } from 'aws-cdk-lib'

dotenv.config()

type BackendStackProps = {
  env: string
  hostedZone: route53.HostedZone
}

export class BackendStack extends cdk.Stack {
  readonly restApi: apigw.RestApi

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // Secret Manager の値
    const secretJson = Secret.fromSecretAttributes(this, 'SecretJson', {
      secretCompleteArn: `arn:aws:secretsmanager:${region}:${accountId}:secret:${
        process.env.DB_URL_ID || ''
      }-${process.env.DB_URL_SUFFIX || ''}`
    })

    // API用Certificate（東京に作る）
    const apiCertificateAPNorthEast1 = new acm.Certificate(
      this,
      `${props.env}-quizzer-api`,
      {
        domainName: process.env.API_DOMAIN_NAME || '',
        validation: acm.CertificateValidation.fromDns(props.hostedZone)
      }
    )

    // Api Container
    //// VPC
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    })
    //// VPC Endpoint
    vpc.addInterfaceEndpoint('ecr-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR
    })
    vpc.addInterfaceEndpoint('logs-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    })
    vpc.addInterfaceEndpoint('sm-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    })
    //// SecurityGroup
    const securityGroupELB = new ec2.SecurityGroup(this, 'SecurityGroupELB', {
      vpc
    })
    securityGroupELB.addIngressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      ec2.Port.tcp(80)
    )
    const securityGroupAPP = new ec2.SecurityGroup(this, 'SecurityGroupAPP', {
      vpc
    })
    // ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      securityGroup: securityGroupELB,
      internetFacing: true
    })
    // TargetGroup
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TG', {
      vpc: vpc,
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/',
        healthyHttpCodes: '200'
      }
    })
    // ALB Listener
    const listenerHTTPS = alb.addListener('ListenerHTTPS', {
      port: 443,
      certificates: [
        elbv2.ListenerCertificate.fromCertificateManager(
          apiCertificateAPNorthEast1
        )
      ]
    })
    listenerHTTPS.addTargetGroups('DefaultHTTPSResponse', {
      targetGroups: [targetGroup]
    })
    // listenerHTTPS.addAction(`albEcsCognitoAutenticateAction`, {
    //   action:
    //     new cdk.aws_elasticloadbalancingv2_actions.AuthenticateCognitoAction({
    //       userPool: props.userPool,
    //       userPoolClient: props.appClient,
    //       userPoolDomain: props.domain,
    //       next: elbv2.ListenerAction.forward([targetGroup])
    //     }),
    //   conditions: [elbv2.ListenerCondition.pathPatterns(['/*'])],
    //   priority: 1
    // })

    //// ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    })
    //// Create ECR Repository
    const ecrRepository = new ecr.Repository(this, 'EcrRepo', {
      repositoryName: `${props.env}-backend-ecr`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteImages: true
    })
    //// Fargate
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      'TaskDef',
      {
        memoryLimitMiB: 1024,
        cpu: 512
      }
    )
    const container = fargateTaskDefinition.addContainer(
      'QuizzerBackendContainer',
      {
        image: ecs.ContainerImage.fromEcrRepository(ecrRepository),
        logging: ecs.LogDrivers.awsLogs({
          streamPrefix: `${props.env}-backend-api-ecs`,
          logRetention: log.RetentionDays.ONE_MONTH
        }),
        secrets: {
          DATABASE_URL: ecs.Secret.fromSecretsManager(
            secretJson,
            'DATABASE_URL'
          )
        },
        environment: {
          APP_ENV: 'local',
          AWS_REGION: process.env.AWS_REGION || '',
          AWS_COGNITO_USERPOOL_ID: process.env.AWS_COGNITO_USERPOOL_ID || '',
          AWS_COGNITO_APPCLIENT_ID: process.env.AWS_COGNITO_APPCLIENT_ID || ''
        }
      }
    )
    container.addPortMappings({
      containerPort: 4000,
      hostPort: 4000
    })
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 1,
      assignPublicIp: false,
      securityGroups: [securityGroupAPP]
    })
    service.attachToApplicationTargetGroup(targetGroup)

    // make route53 record to ALB domain
    makeRecordsToALB(
      this,
      process.env.API_DOMAIN_NAME || '',
      alb,
      props.hostedZone
    )
  }
}
