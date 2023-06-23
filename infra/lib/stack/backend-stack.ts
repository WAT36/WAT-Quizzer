import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as path from 'path'
import { params } from '../params'
import * as dotenv from 'dotenv'

dotenv.config()

type BackendStackProps = {
  env: string
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id)

    const { region, accountId } = new cdk.ScopedAws(this)

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // S3 Bucket for NestJS Lambda
    const bucket = new s3.Bucket(this, 'nestJSLambdaBucket', {
      bucketName: `${props.env}-nestjsapi-lambda-layer-bucket`
    })

    // Lambda layer
    const layer = new lambda.LayerVersion(
      this,
      `${props.env}QuizzerlambdaLayer`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../../backend-nest/node_modules')
        ),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X]
      }
    )

    // Lambda
    const nestLambda = new lambda.Function(this, `${props.env}QuizzerApi`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'src/main.handler',
      layers: [layer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        REGION: region,
        DB_URL_ID: process.env.DB_URL_ID || ''
      },
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../backend-nest/dist')
      )
    })

    // LambdaにSecrets Manager への権限付与
    const stringSecretArn = `arn:aws:secretsmanager:${region}:${accountId}:secret:${
      process.env.DB_URL_ID || ''
    }-${process.env.DB_URL_SUFFIX || ''}`
    const smResource = Secret.fromSecretCompleteArn(
      this,
      'SecretsManager',
      stringSecretArn
    )
    smResource.grantRead(nestLambda)

    // API Gateway
    const restApi = new apigw.RestApi(this, `NestAppApiGateway`, {
      restApiName: `NestAppApiGw`,
      deployOptions: {
        stageName: 'v1'
      },
      // CORS
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
        statusCode: 200
      }
    })

    restApi.root.addProxy({
      defaultIntegration: new apigw.LambdaIntegration(nestLambda),
      anyMethod: true
    })
  }
}
