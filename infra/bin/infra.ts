#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BackendStack } from '../lib/stack/backend-stack'
import { FrontendStack } from '../lib/stack/frontend-stack'
import { UsEast1Stack } from '../lib/stack/us-east1-stack'

const app = new cdk.App()
const env = app.node.tryGetContext('env')

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env
})

const backendStack = new BackendStack(app, 'BackendStack', { env })

const usEast1Stack = new UsEast1Stack(app, `UsEast1Stack`, {
  env,
  s3Bucket: frontendStack.s3Bucket,
  restApi: backendStack.restApi
})

usEast1Stack.addDependency(frontendStack)
usEast1Stack.addDependency(backendStack)
