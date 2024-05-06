#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BackendStack } from '../lib/stack/backend-stack'
import { FrontendStack } from '../lib/stack/frontend-stack'
import { UsEast1Stack } from '../lib/stack/us-east1-stack'
import { DnsStack } from '../lib/stack/usEast1/dns-stack'
import { CertificateStack } from '../lib/stack/usEast1/certificate-stack'

const app = new cdk.App()
const env = app.node.tryGetContext('env')

const dnsStack = new DnsStack(app, `${env}QuizzerDnsStack`, {
  env
})

const certificateStack = new CertificateStack(app, `${env}CertificateStack`, {
  env,
  hostedZone: dnsStack.hostedZone
})
certificateStack.addDependency(dnsStack)

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env
})

const usEast1Stack = new UsEast1Stack(app, `UsEast1Stack`, {
  env,
  s3Bucket: frontendStack.s3Bucket,
  frontCertificate: certificateStack.frontCertificate,
  hostedZone: dnsStack.hostedZone
})
usEast1Stack.addDependency(frontendStack)

const backendStack = new BackendStack(app, 'BackendStack', {
  env,
  hostedZone: dnsStack.hostedZone
})
backendStack.addDependency(certificateStack)
