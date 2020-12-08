import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { PythonFunction, PythonLayerVersion } from '@aws-cdk/aws-lambda-python'
import { AssetHashType, Construct, Stack, StackProps } from '@aws-cdk/core'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export class SampleCdkLambdaBundlingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new NodejsFunction(this, 'fizzbuzz-nodejs-func', {
      entry: 'src/lambda/node/fizzbuzz.ts',
    })

    new PythonFunction(this, 'fizzbuzz-python-func', {
      entry: 'src/lambda/python',
      index: 'fizzbuzz.py',
    })

    copyFileSync('Pipfile', 'src/lambda-layer/Pipfile')
    copyFileSync('Pipfile.lock', 'src/lambda-layer/Pipfile.lock')
    const pythonLayer = new PythonLayerVersion(this, 'python-layer', {
      entry: 'src/lambda-layer',
      compatibleRuntimes: [Runtime.PYTHON_3_8],
    })
    new Function(this, 'fizzbuzz-python-with-layer-func', {
      handler: 'fizzbuzz.handler',
      code: Code.fromAsset(
        resolve(__dirname, '..', 'src', 'lambda', 'python-with-layer')
      ),
      runtime: Runtime.PYTHON_3_8,
      layers: [pythonLayer],
    })

    new Function(this, 'fizzbuzz-go-func', {
      handler: 'main',
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(resolve(__dirname, '..', 'src', 'lambda', 'go'), {
        assetHashType: AssetHashType.OUTPUT,
        bundling: {
          image: Runtime.GO_1_X.bundlingDockerImage,
          command: [
            'bash',
            '-c',
            'GOOS=linux GOARCH=amd64 go build -o /asset-output/main',
          ],
          user: 'root',
        },
      }),
    })

    const nodejsLayer = new LayerVersion(this, 'NodejsLayer', {
      code: Code.fromAsset(resolve(__dirname, '..'), {
        assetHashType: AssetHashType.OUTPUT,
        bundling: {
          image: Runtime.NODEJS_12_X.bundlingDockerImage,
          command: [
            'bash',
            '-c',
            [
              'npm install -sg yarn',
              'mkdir -p /asset-output/nodejs/',
              'cp package.json yarn.lock /asset-output/nodejs/',
              'yarn install --force --silent --production --cwd /asset-output/nodejs/',
            ].join(' && '),
          ],
          user: 'root',
        },
      }),
      compatibleRuntimes: [Runtime.NODEJS_12_X],
    })
    new Function(this, 'fizzbuzz-nodejs-with-layer-func', {
      handler: 'src/lambda/node/fizzbuzz.handler',
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(resolve(__dirname, '..'), {
        assetHashType: AssetHashType.OUTPUT,
        bundling: {
          image: Runtime.NODEJS_12_X.bundlingDockerImage,
          command: [
            'bash',
            '-c',
            [
              'npm install -sg yarn',
              'cp -au src tsconfig.json package.json yarn.lock /tmp',
              'cd /tmp',
              'yarn install --force --silent',
              'yarn ts-build --outDir /asset-output',
            ].join(' && '),
          ],
          user: 'root',
        },
      }),
      layers: [nodejsLayer],
    })
  }
}
