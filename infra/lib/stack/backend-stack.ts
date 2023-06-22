import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as path from 'path'

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // S3 Bucket for NestJS Lambda
    const bucket = new s3.Bucket(this, 'nestJSLambdaBucket', {
      bucketName: 'dev-nestjsapi-lambda-layer-bucket'
    })

    // Lambda layer
    const layer = new lambda.LayerVersion(this, `devQuizzerlambdaLayer`, {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../backend-nest/node_modules')
      ),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X]
    })

    // Lambda
    const nestLambda = new lambda.Function(this, 'devQuizzerApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'src/main.handler',
      layers: [layer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      },
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../backend-nest/dist')
      )
    })

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
