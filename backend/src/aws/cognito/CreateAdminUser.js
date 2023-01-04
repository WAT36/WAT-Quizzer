const AWS = require('aws-sdk')
var dotenv = require('dotenv')
var path = require('path')
var env = dotenv.config({ path: path.join(__dirname, '../../../config/.env') })

const accessKeyId = process.env.IAM_ACCESSKEY // IAMから取得
const secretAccessKey = process.env.IAM_SECRETACCESSKEY // IAMから取得
const userPoolId = process.env.COGNITO_USERPOOL // Cognito ユーザープールの全般設定で表示されるプールID
const cognito = new AWS.CognitoIdentityServiceProvider({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'ap-northeast-1'
})
const params = {
  UserPoolId: userPoolId, // required
  Username: 'WataruT', // required (ログインユーザー名)
  ForceAliasCreation: true,
  MessageAction: 'SUPPRESS',
  UserAttributes: [
    {
      Name: 'email',
      Value: 'motohari.xanadu@gmail.com' // 属性のメールアドレスを指定
    }
  ]
}
cognito
  .adminCreateUser(params)
  .promise()
  .then((user) => {
    console.log(user)
  })
  .catch((err) => {
    console.log(err)
  })
