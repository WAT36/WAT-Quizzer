import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'

dotenv.config()

type CertificateStackProps = {
  env: string
  hostedZone: route53.HostedZone
}

// us-east-1(その他、グローバル)リージョンに作成する、証明書リソース
export class CertificateStack extends cdk.Stack {
  readonly frontCertificate: acm.Certificate
  readonly apiCertificate: acm.Certificate

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, {
      env: { region: 'us-east-1' },
      crossRegionReferences: true
    })

    // ACM（quizzerフロント用）
    this.frontCertificate = new acm.Certificate(
      this,
      `${props.env}-quizzer-front`,
      {
        domainName: process.env.FRONT_DOMAIN_NAME || '',
        validation: acm.CertificateValidation.fromDns(props.hostedZone)
      }
    )

    // ACM（quizzer API用）
    const apiCertificate = new acm.Certificate(
      this,
      `${props.env}-quizzer-api`,
      {
        domainName: process.env.API_DOMAIN_NAME || '',
        validation: acm.CertificateValidation.fromDns(props.hostedZone)
      }
    )
  }
}
