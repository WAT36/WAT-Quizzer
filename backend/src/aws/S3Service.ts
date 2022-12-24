import { S3, config as awsConfig } from 'aws-sdk'
import { config as dotenvConfig } from 'dotenv'
import { join } from 'path'
const env = dotenvConfig({ path: join(__dirname, '../../config/.env') })

const AWS_ACCESS_KEY = process.env.IAM_ACCESSKEY
const AWS_SECRET_KEY = process.env.IAM_SECRETACCESSKEY
const BUCKET = process.env.S3_BUCKET_NAME

awsConfig.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
})

export const upload = (file: File) => {
  const s3 = new S3()
  const params = {
    Bucket: BUCKET,
    Key: file.name,
    Expires: 60,
    ContentType: file.type
  }

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        reject(err)
      }
      resolve(url)
    })
  })
}
