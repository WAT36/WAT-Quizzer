import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as cognito from 'aws-cdk-lib/aws-cognito'

dotenv.config()

type AuthStackProps = {
  env: string
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
    userPool.addClient('userPoolAppClient', {
      generateSecret: false,
      oAuth: {
        callbackUrls: [process.env.FRONT_CALLBACK_URL || ''],
        logoutUrls: [process.env.LOGOUT_URL || '']
      }
    })
  }
}
