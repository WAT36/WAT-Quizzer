import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { makeRecordsToFrontDistribution } from '../service/route53'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import {
  makeReadbleQuizzerBucketIamRole,
  makeUnauthenticatedQuizzerBucketIamRole
} from '../service/iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ssm from 'aws-cdk-lib/aws-ssm'

dotenv.config()

type FrontendStackProps = {
  env: string
  certificate: acm.Certificate
  hostedZone: route53.HostedZone
  edgeLambda: lambda.Function
}

export class FrontendStack extends cdk.Stack {
  readonly s3Bucket: s3.Bucket
  readonly distribution: cloudfront.Distribution

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // S3 Bucket
    this.s3Bucket = new s3.Bucket(this, `${props.env}QuizzerFrontBucket`, {
      bucketName: `${props.env}-quizzer-front-bucket`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: []
        }
      ]
    })
    // OAC
    const cfnOriginAccessControl = new cloudfront.CfnOriginAccessControl(
      this,
      `${props.env}OriginAccessControl`,
      {
        originAccessControlConfig: {
          name: 'OriginAccessControlForContentsBucket',
          originAccessControlOriginType: 's3',
          signingBehavior: 'always',
          signingProtocol: 'sigv4',
          description: 'Access Control'
        }
      }
    )

    // cognito userpool
    const userPool = new cognito.UserPool(this, `${props.env}QuizzerUserPool`, {
      signInAliases: {
        username: true,
        phone: false,
        email: false,
        preferredUsername: true
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      signInCaseSensitive: true,
      accountRecovery: cognito.AccountRecovery.NONE,
      selfSignUpEnabled: false,
      email: cognito.UserPoolEmail.withCognito()
    })

    // cognito domain
    const domain = userPool.addDomain('userPoolDomain', {
      cognitoDomain: { domainPrefix: process.env.COGNITO_DOMAIN || '' }
    })

    // cognito app client
    const appClient = userPool.addClient('userPoolAppClient', {
      generateSecret: false,
      oAuth: {
        callbackUrls: [process.env.FRONT_CALLBACK_URL || ''],
        logoutUrls: [process.env.LOGOUT_URL || ''],
        scopes: [cognito.OAuthScope.OPENID],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false
        }
      }
    })

    // read s3 iam role
    const authenticatedRole = makeReadbleQuizzerBucketIamRole(
      this,
      props.env,
      this.s3Bucket.bucketName
    )

    // read s3 iam role
    const unauthenticatedRole = makeUnauthenticatedQuizzerBucketIamRole(
      this,
      props.env,
      this.s3Bucket.bucketName
    )

    // cognito Identity pool
    const idPool = new cognito.CfnIdentityPool(
      this,
      `${props.env}QuizzerIdPool`,
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            providerName: userPool.userPoolProviderName,
            clientId: appClient.userPoolClientId
          }
        ]
      }
    )

    // cognito Identity pool attaching role
    new cognito.CfnIdentityPoolRoleAttachment(this, 'roleAttachment', {
      identityPoolId: idPool.ref,
      roles: {
        authenticated: authenticatedRole.iamRole.roleArn,
        unauthenticated: unauthenticatedRole.iamRole.roleArn
      }
    })

    // make admin user
    new cognito.CfnUserPoolUser(this, `${props.env}QuizzerAdminUser`, {
      userPoolId: userPool.userPoolId,
      username: process.env.ADMIN_USER_NAME || '',
      messageAction: 'SUPPRESS'
    })

    // cloudfront
    this.distribution = new cloudfront.Distribution(
      this,
      `${props.env}QuizzerFrontDistribution`,
      {
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            ttl: cdk.Duration.seconds(300),
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: '/404.html'
          }
        ],
        defaultBehavior: {
          origin: new origins.S3Origin(this.s3Bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          edgeLambdas: [
            {
              functionVersion: props.edgeLambda.currentVersion,
              eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST
            }
          ]
        },
        domainNames: [process.env.FRONT_DOMAIN_NAME || ''],
        certificate: props.certificate
      }
    )

    const bucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [
        new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com')
      ],
      resources: [`${this.s3Bucket.bucketArn}/*`]
    })
    bucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${
        cdk.Stack.of(this).account
      }:distribution/${this.distribution.distributionId}`
    })

    this.s3Bucket.addToResourcePolicy(bucketPolicyStatement)

    const cfnDistribution = this.distribution.node
      .defaultChild as cloudfront.CfnDistribution
    // OAI削除（勝手に設定されるため）
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      ''
    )
    // OAC設定
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      cfnOriginAccessControl.attrId
    )
    cfnDistribution.addPropertyDeletionOverride(
      'DistributionConfig.Origins.0.CustomOriginConfig'
    )

    // DNS Record
    makeRecordsToFrontDistribution(
      this,
      process.env.FRONT_DOMAIN_NAME || '',
      this.distribution,
      props.hostedZone
    )

    // SSM Parameter
    const jsonValue = {
      NODE_PATH: '$NODE_PATH:/opt',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: region,
      USERPOOL_ID: userPool.userPoolId,
      USERPOOL_APPCLIENT_ID: appClient.userPoolClientId,
      USERPOOL_COGNITO_DOMAIN: `${domain.domainName}.auth.${region}.amazoncognito.com`
    }
    new ssm.StringParameter(this, process.env.PARAMETER_STORE || '', {
      parameterName: process.env.PARAMETER_STORE || '',
      stringValue: JSON.stringify(jsonValue)
    })
  }
}
