import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'

dotenv.config()

type DnsStackProps = {
  env: string
}

export class DnsStack extends cdk.Stack {
  readonly hostedZone: route53.HostedZone

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    this.hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: process.env.HOSTZONE_NAME || ''
    })
    this.hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)
  }
}
