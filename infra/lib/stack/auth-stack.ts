import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {
  makeReadbleQuizzerBucketIamRole,
  makeUnauthenticatedQuizzerBucketIamRole
} from '../service/iam'
import * as path from 'path'

dotenv.config()

type AuthStackProps = {
  env: string
  s3BucketName: string
}

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

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
      props.s3BucketName
    )

    // read s3 iam role
    const unauthenticatedRole = makeUnauthenticatedQuizzerBucketIamRole(
      this,
      props.env,
      props.s3BucketName
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

    // Cognito at edge Lambda
    const edgeLambda = new lambda.Function(
      this,
      `${props.env}CognitoLambdaAtEdge`,
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        environment: {
          NODE_PATH: '$NODE_PATH:/opt',
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
          REGION: region,
          USERPOOL_ID: userPool.userPoolId,
          USERPOOL_APPCLIENT_ID: appClient.userPoolClientId,
          USERPOOL_COGNITO_DOMAIN: `${domain.domainName}.auth.${region}.amazoncognito.com`
        },
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../service/lambda-edge/cognito-at-edge')
        )
      }
    )
  }
}
