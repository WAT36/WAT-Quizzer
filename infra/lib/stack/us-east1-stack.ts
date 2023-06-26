import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'

dotenv.config()

type UsEast1StackProps = {
  env: string
  hostedZone: route53.HostedZone
}

// us-east-1リージョンに作成するリソース
export class UsEast1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UsEast1StackProps) {
    super(scope, id, {
      env: { region: 'us-east-1' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // ACM（quizzerフロント用）
    const certificateManager = new acm.Certificate(
      this,
      `${props.env}-quizzer-front`,
      {
        domainName: process.env.FRONT_DOMAIN_NAME || '',
        validation: acm.CertificateValidation.fromDns(props.hostedZone)
      }
    )
  }
}
