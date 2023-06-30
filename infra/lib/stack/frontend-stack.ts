import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { makeRecordsToFrontDistribution } from '../service/route53'

dotenv.config()

type FrontendStackProps = {
  env: string
  certificate: acm.Certificate
  hostedZone: route53.HostedZone
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // S3 Bucket
    const bucket = new s3.Bucket(this, `${props.env}QuizzerFrontBucket`, {
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
          origin: new origins.S3Origin(bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
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
      resources: [`${bucket.bucketArn}/*`]
    })
    bucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${
        cdk.Stack.of(this).account
      }:distribution/${distribution.distributionId}`
    })

    bucket.addToResourcePolicy(bucketPolicyStatement)

    const cfnDistribution = distribution.node
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
      distribution,
      props.hostedZone
    )
  }
}
