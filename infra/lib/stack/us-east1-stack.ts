import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import { makeQuizzerLambdaEdgeIamRole } from '../service/iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { makeRecordsToFrontDistribution } from '../service/route53'

dotenv.config()

type UsEast1StackProps = {
  env: string
  s3Bucket: s3.Bucket
}

// us-east-1(その他、グローバル)リージョンに作成するリソース
export class UsEast1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UsEast1StackProps) {
    super(scope, id, {
      env: { region: 'us-east-1' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // DNS hostzone
    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: process.env.HOSTZONE_NAME || ''
    })
    hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)

    // ACM（quizzerフロント用）
    const certificate = new acm.Certificate(
      this,
      `${props.env}-quizzer-front`,
      {
        domainName: process.env.FRONT_DOMAIN_NAME || '',
        validation: acm.CertificateValidation.fromDns(hostedZone)
      }
    )

    // Lambda layer
    const layer = new lambda.LayerVersion(
      this,
      `${props.env}CognitoLambdaAtEdgeLayer`,
      {
        code: lambda.Code.fromAsset(
          path.join(
            __dirname,
            '../service/lambda-edge/cognito-at-edge/node_modules'
          )
        ),
        compatibleRuntimes: [lambda.Runtime.NODEJS_16_X]
      }
    )

    // Cognito at edge Lambda
    const edgeLambdaRole = makeQuizzerLambdaEdgeIamRole(this, props.env)
    const edgeLambda = new lambda.Function(
      this,
      `${props.env}CognitoLambdaAtEdge`,
      {
        //layers: [layer],
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        role: edgeLambdaRole.iamRole,
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../service/lambda-edge/cognito-at-edge/src')
        )
      }
    )

    // cloudfront
    const distribution = new cloudfront.Distribution(
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
          origin: new origins.S3Origin(props.s3Bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          edgeLambdas: [
            {
              functionVersion: edgeLambda.currentVersion,
              eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST
            }
          ]
        },
        domainNames: [process.env.FRONT_DOMAIN_NAME || ''],
        certificate: certificate
      }
    )

    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution
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
      distribution,
      hostedZone
    )
  }
}
