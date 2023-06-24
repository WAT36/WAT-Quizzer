#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { InfraStack } from '../lib/infra-stack'
import { BackendStack } from '../lib/stack/backend-stack'
import { FrontendStack } from '../lib/stack/frontend-stack'

const app = new cdk.App()
const env = app.node.tryGetContext('env')

new FrontendStack(app, 'FrontendStack', { env })

new BackendStack(app, 'BackendStack', { env })
