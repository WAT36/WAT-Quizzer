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

const dnsStack = new DnsStack(app, 'DnsStack', {
  env
})

const certificateStack = new CertificateStack(app, 'CertificateStack', {
  env,
  hostedZone: dnsStack.hostedZone
})

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env
})

const backendStack = new BackendStack(app, 'BackendStack', {
  env,
  apiCertificate: certificateStack.apiCertificate,
  hostedZone: dnsStack.hostedZone
})

const usEast1Stack = new UsEast1Stack(app, `UsEast1Stack`, {
  env,
  s3Bucket: frontendStack.s3Bucket,
  restApi: backendStack.restApi,
  frontCertificate: certificateStack.frontCertificate,
  hostedZone: dnsStack.hostedZone
})

certificateStack.addDependency(dnsStack)
backendStack.addDependency(certificateStack)
usEast1Stack.addDependency(frontendStack)
usEast1Stack.addDependency(backendStack)
