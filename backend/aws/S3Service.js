const aws = require("aws-sdk");
var dotenv = require('dotenv');
const path = require("path");
var env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

const AWS_ACCESS_KEY = process.env.IAM_ACCESSKEY;
const AWS_SECRET_KEY = process.env.IAM_SECRETACCESSKEY;
const BUCKET = process.env.S3_BUCKET_NAME;

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});

function upload(file) {
    const s3 = new aws.S3();
    const params = {
        Bucket: BUCKET,
        Key: file.filename,
        Expires: 60,
        ContentType: file.filetype,
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl("putObject", params, (err, url) => {
            if (err) {
                reject(err);
            }
            resolve(url);
        });
    });
}

// モジュール化
module.exports = {
    upload,
}
