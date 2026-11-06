import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { makeRecordsToDistribution } from '../service/route53'
import { makeDetailWordRewriteAssociation } from '../service/cloudfront'

dotenv.config()

type MockStackProps = {
  env: string
  mockCertificate: acm.Certificate
  hostedZone: route53.HostedZone
}

export class MockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MockStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || 'ap-northeast-1' },
      crossRegionReferences: true
    })

    // S3 Bucket for CloudFront origin (private, only accessible via CloudFront)
    const mockBucket = new s3.Bucket(this, `MockQuizzerFrontBucket`, {
      bucketName: `mock-quizzer-front-bucket-${this.account}`,
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

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      'MockQuizzerDistribution',
      {
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new origins.S3Origin(mockBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          functionAssociations: [
            makeDetailWordRewriteAssociation(
              this,
              'MockDetailWordRewriteFunction'
            )
          ]
        },
        domainNames: [process.env.MOCK_FRONT_DOMAIN_NAME || ''],
        certificate: props.mockCertificate,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        comment: 'Mock Quizzer Frontend Distribution'
      }
    )

    // OAC (Origin Access Control)
    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution
    const cfnOriginAccessControl = new cloudfront.CfnOriginAccessControl(
      this,
      'MockOriginAccessControl',
      {
        originAccessControlConfig: {
          name: 'OriginAccessControlForMockBucket',
          originAccessControlOriginType: 's3',
          signingBehavior: 'always',
          signingProtocol: 'sigv4',
          description: 'Access Control for Mock Bucket'
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

    // S3 Bucket Policy: CloudFrontからのみアクセスを許可
    const bucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [
        new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com')
      ],
      resources: [`${mockBucket.bucketArn}/*`]
    })
    bucketPolicyStatement.addCondition('StringEquals', {
      'AWS:SourceArn': `arn:aws:cloudfront::${
        cdk.Stack.of(this).account
      }:distribution/${distribution.distributionId}`
    })

    mockBucket.addToResourcePolicy(bucketPolicyStatement)

    // DNS Record
    makeRecordsToDistribution(
      this,
      process.env.MOCK_FRONT_DOMAIN_NAME || '',
      distribution,
      props.hostedZone
    )

    // Outputs
    new cdk.CfnOutput(this, 'MockBucketName', {
      value: mockBucket.bucketName,
      description: 'Mock S3 Bucket Name'
    })

    new cdk.CfnOutput(this, 'MockDistributionId', {
      value: distribution.distributionId,
      description: 'Mock CloudFront Distribution ID'
    })

    new cdk.CfnOutput(this, 'MockDistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'Mock CloudFront Distribution Domain Name'
    })

    new cdk.CfnOutput(this, 'MockWebsiteURL', {
      value: `https://${process.env.MOCK_FRONT_DOMAIN_NAME || distribution.distributionDomainName}`,
      description: 'Mock Website URL'
    })
  }
}
