import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import { makeQuizzerLambdaEdgeIamRole } from '../service/iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

dotenv.config()

type UsEast1StackProps = {
  env: string
  hostedZone: route53.HostedZone
}

// us-east-1リージョンに作成するリソース
export class UsEast1Stack extends cdk.Stack {
  readonly certificate: acm.Certificate
  readonly edgeLambda: lambda.Function

  constructor(scope: Construct, id: string, props: UsEast1StackProps) {
    super(scope, id, {
      env: { region: 'us-east-1' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // ACM（quizzerフロント用）
    this.certificate = new acm.Certificate(this, `${props.env}-quizzer-front`, {
      domainName: process.env.FRONT_DOMAIN_NAME || '',
      validation: acm.CertificateValidation.fromDns(props.hostedZone)
    })

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
    this.edgeLambda = new lambda.Function(
      this,
      `${props.env}CognitoLambdaAtEdge`,
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        role: edgeLambdaRole.iamRole,
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../service/lambda-edge/cognito-at-edge/src')
        )
      }
    )
  }
}
