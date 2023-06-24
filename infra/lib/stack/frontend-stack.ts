import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'

dotenv.config()

type FrontendStackProps = {
  env: string
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id)

    const { region, accountId } = new cdk.ScopedAws(this)

    // S3 Bucket
    const bucket = new s3.Bucket(this, `${props.env}QuizzerFrontBucket`, {
      bucketName: `${props.env}-quizzer-front-bucket`
    })
  }
}
