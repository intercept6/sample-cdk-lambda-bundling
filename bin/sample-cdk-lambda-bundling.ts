#!/usr/bin/env node
import { SampleCdkLambdaBundlingStack } from '../lib/sample-cdk-lambda-bundling-stack'
import { App } from '@aws-cdk/core'
import 'source-map-support/register'

const app = new App()
new SampleCdkLambdaBundlingStack(app, 'SampleCdkLambdaBundlingStack', {
  env: { region: process.env.AWS_REGION, account: process.env.AWS_ACCOUNT },
})
