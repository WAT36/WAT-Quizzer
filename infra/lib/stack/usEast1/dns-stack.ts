import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'

dotenv.config()

type DnsStackProps = {
  env: string
}

// us-east-1(その他、グローバル)リージョンに作成する、DNS系のリソース
export class DnsStack extends cdk.Stack {
  readonly hostedZone: route53.HostedZone

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    // 既に作ったホストゾーンをインポートする
    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'HostedZone',
      {
        zoneName: process.env.HOSTZONE_NAME || '',
        hostedZoneId: process.env.HOSTZONE_ID || ''
      }
    ) as route53.HostedZone

    //this.hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
  }
}
