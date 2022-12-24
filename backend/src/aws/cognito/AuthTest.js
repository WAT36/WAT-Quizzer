const AWS = require('aws-sdk');
const crypto = require('crypto');
var dotenv = require('dotenv');
var path = require('path');
var env = dotenv.config({path: path.join(__dirname, "../../../config/.env")})

const accessKeyId = process.env.IAM_ACCESSKEY; // IAMから取得
const secretAccessKey = process.env.IAM_SECRETACCESSKEY; // IAMから取得
const userPoolId = process.env.COGNITO_USERPOOL; // Cognito ユーザープールの全般設定で表示されるプールID
const clientId = process.env.COGNITO_APPCLIENT_ID; // Cognito アプリクライアントで表示されるアプリクライアント ID
const clientSecret = process.env.COGNITO_APPCLIENT_SECRETID; // Cognito アプリクライアントで表示されるアプリクライアントのシークレット
const cognito = new AWS.CognitoIdentityServiceProvider({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'ap-northeast-1'
});
// SECRET_HASHは、ユーザー名とクライアントIDを結合し、ハッシュ化したものを設定
const params = {
    UserPoolId: userPoolId, // required
    ClientId: clientId, // required
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH', //USER_SRP_AUTH | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH | ADMIN_USER_PASSWORD_AUTH
    AuthParameters: {
        USERNAME: 'WataruT',
        PASSWORD: '!nH0u5eNeet',
        SECRET_HASH: crypto.createHmac('sha256', clientSecret).update('WataruT' + clientId).digest('base64')
    }
};
cognito.adminInitiateAuth(params).promise()
.then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});