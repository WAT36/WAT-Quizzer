import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'

export const makeRecordsToDistribution = (
  scope: Construct,
  recordName: string,
  distribution: cloudfront.Distribution,
  hostedZone: route53.HostedZone
) => {
  // make A record
  new route53.ARecord(scope, `ARecordOf${recordName.replace(/[-\.]/g, '')}`, {
    target: route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(distribution)
    ),
    zone: hostedZone,
    recordName
  })

  // make AAAA record
  new route53.AaaaRecord(
    scope,
    `AAAARecordOf${recordName.replace(/[-\.]/g, '')}`,
    {
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: hostedZone,
      recordName
    }
  )
}

export const makeRecordsToALB = (
  scope: Construct,
  recordName: string,
  alb: elbv2.ApplicationLoadBalancer,
  hostedZone: route53.HostedZone
) => {
  // make A record
  new route53.ARecord(scope, `ARecordOf${recordName.replace(/[-\.]/g, '')}`, {
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(alb)),
    zone: hostedZone,
    recordName
  })

  // make AAAA record
  new route53.AaaaRecord(
    scope,
    `AAAARecordOf${recordName.replace(/[-\.]/g, '')}`,
    {
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(alb)
      ),
      zone: hostedZone,
      recordName
    }
  )
}
