/// <reference types="multer" />
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import type { Readable } from 'stream'
import { randomBytes } from 'crypto'
import * as dotenv from 'dotenv'

dotenv.config()

export const getS3Client = () => {
  return new S3Client({
    region: process.env.REGION || '',
    credentials: {
      accessKeyId: process.env.AKEY || '',
      secretAccessKey: process.env.SAKEY || ''
    }
  })
}

// 問題用の画像をS3にアップロードし、保存したファイル名を返す
// バケット名を外部に出さないよう、URLではなくファイル名を返す
export const uploadQuizImageToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  let bodyBuffer: Buffer
  if (Buffer.isBuffer(file.buffer)) {
    bodyBuffer = file.buffer // 通常の Buffer
  } else if (typeof file.buffer === 'string') {
    // API Gateway 経由で base64 文字列になっている場合
    bodyBuffer = Buffer.from(file.buffer, 'base64')
  } else {
    throw new Error('Unsupported file.buffer type: ' + typeof file.buffer)
  }

  const bucketName = process.env.QUIZ_IMAGE_S3_BUCKET
  const uploadParams = {
    Bucket: bucketName,
    Key: `uploads/${file.originalname}`,
    Body: bodyBuffer,
    ContentType: file.mimetype
  }
  console.log('upload img buffer length:' + file.buffer.length)
  console.log('upload img buffer byteLength:' + file.buffer.byteLength)
  const s3Client = getS3Client()
  await s3Client.send(new PutObjectCommand(uploadParams))
  return file.originalname
}

// Webから取り込んだ画像のファイル名を作る
// 手動アップロードの画像（元のファイル名のまま保存）を上書きしないよう、問題ID・日時・乱数で一意な名前にする
// 例: auto_q123_20261120153045_a1b2c3d4.jpg
export const generateAutoQuizImageFileName = (
  quizId: number,
  extension: string,
  now: Date = new Date()
): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const timestamp =
    String(now.getFullYear()) +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  return `auto_q${quizId}_${timestamp}_${randomBytes(4).toString('hex')}.${extension}`
}

// 画像データを指定したファイル名でS3に保存する（Webから取り込んだ画像用）
export const putQuizImageToS3 = async (
  fileName: string,
  body: Buffer,
  contentType: string
): Promise<void> => {
  const s3Client = getS3Client()
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.QUIZ_IMAGE_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: body,
      ContentType: contentType
    })
  )
}

export const getQuizImageFromS3 = async (fileName: string): Promise<Buffer> => {
  const bucketName = process.env.QUIZ_IMAGE_S3_BUCKET
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `uploads/${fileName}`
  })
  const s3Client = getS3Client()
  const response = await s3Client.send(command)
  const stream = response.Body as Readable
  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array)
  }
  return Buffer.concat(chunks)
}
