import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import {
  makeReadbleQuizzerBucketIamRole,
  makeUnauthenticatedQuizzerBucketIamRole
} from '../service/iam'

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
    userPool.addDomain('userPoolDomain', {
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
  }
}
