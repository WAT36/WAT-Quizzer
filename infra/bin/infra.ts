#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BackendStack } from '../lib/stack/backend-stack'
import { FrontendStack } from '../lib/stack/frontend-stack'
import { DnsStack } from '../lib/stack/dns-stack'
import { UsEast1Stack } from '../lib/stack/us-east1-stack'

const app = new cdk.App()
const env = app.node.tryGetContext('env')

const dnsStack = new DnsStack(app, 'DnsStack', { env })

const usEast1Stack = new UsEast1Stack(app, 'UsEast1Stack', {
  env,
  hostedZone: dnsStack.hostedZone
})

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env,
  certificate: usEast1Stack.certificate,
  hostedZone: dnsStack.hostedZone
})

new BackendStack(app, 'BackendStack', { env })

usEast1Stack.addDependency(dnsStack)
frontendStack.addDependency(usEast1Stack)
