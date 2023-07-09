import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import {
  makeReadbleQuizzerBucketIamRole,
  makeUnauthenticatedQuizzerBucketIamRole
} from '../service/iam'

dotenv.config()

type FrontendStackProps = {
  env: string
}

export class FrontendStack extends cdk.Stack {
  readonly s3Bucket: s3.Bucket

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

    // read s3 iam role
    const authenticatedRole = makeReadbleQuizzerBucketIamRole(
      this,
      props.env,
      this.s3Bucket.bucketName,
      idPool.ref
    )

    // read s3 iam role
    const unauthenticatedRole = makeUnauthenticatedQuizzerBucketIamRole(
      this,
      props.env,
      this.s3Bucket.bucketName,
      idPool.ref
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

    const bucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [
        new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com')
      ],
      resources: [`${this.s3Bucket.bucketArn}/*`]
    })
    bucketPolicyStatement.addCondition('StringLike', {
      'AWS:SourceArn': `arn:aws:cloudfront::${
        cdk.Stack.of(this).account
      }:distribution/*`
    })

    this.s3Bucket.addToResourcePolicy(bucketPolicyStatement)
  }
}
