const { Authenticator } = require('cognito-at-edge')
const fs = require('fs')

const value = JSON.parse(fs.readFileSync('./ids.json', 'utf8'))
const authenticator = new Authenticator({
  region: value.REGION,
  userPoolId: value.USERPOOL_ID,
  userPoolAppId: value.USERPOOL_APPCLIENT_ID,
  userPoolDomain: value.USERPOOL_COGNITO_DOMAIN,
  logLevel: 'debug'
})

exports.handler = async (request) => {
  return authenticator.handle(request)
}
