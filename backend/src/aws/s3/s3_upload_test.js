const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

var dotenv = require('dotenv')

var env = dotenv.config({ path: path.join(__dirname, '../../../config/.env') })
var s3 = new AWS.S3()

// S3へファイルアップロード
// 自動でマルチパートアップロードもやってくれる
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
s3.upload(
  {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'img3.png',
    Body: fs.createReadStream(path.join(__dirname, './img3.jpg')),
    ContentType: 'image/jpg'
  },
  {
    partSize: 100 * 1024 * 1024,
    queueSize: 4
  },
  (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(JSON.stringify(data))
  }
)
