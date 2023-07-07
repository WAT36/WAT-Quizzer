const { Authenticator } = require('cognito-at-edge')
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm')

const client = new SSMClient()
const input = {
  // GetParameterRequest
  Name: '/edge/quizzer/dev'
}
const command = new GetParameterCommand(input)
const response = await client.send(command)
const value = JSON.parse(response.Parameter.Value)

const authenticator = new Authenticator({
  region: value.REGION,
  userPoolId: value.USERPOOL_ID,
  userPoolAppId: value.USERPOOL_APPCLIENT_ID,
  userPoolDomain: value.USERPOOL_COGNITO_DOMAIN
})

exports.handler = async (request) => {
  return authenticator.handle(request)
}
