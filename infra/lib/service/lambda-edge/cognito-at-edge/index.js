const { Authenticator } = require('cognito-at-edge')

const authenticator = new Authenticator({
  region: process.env.REGION,
  userPoolId: process.env.USERPOOL_ID,
  userPoolAppId: process.env.USERPOOL_APPCLIENT_ID,
  userPoolDomain: process.env.USERPOOL_COGNITO_DOMAIN
})

exports.handler = async (request) => {
  return authenticator.handle(request)
}
