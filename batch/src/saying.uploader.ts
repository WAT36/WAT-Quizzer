import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'
import { SignInSuccessResult } from 'quizzer-lib'
import { signInForBatch } from './tools/signin'
export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

// 引数チェック
if (process.argv.length !== 3) {
  console.error(
    'Error: Usage: npx ts-node src/saying.uploader.ts (Input file name)'
  )
  process.exit(1)
}

//  ファイル存在チェック
const inputFilePath = '../' + process.argv[2]
try {
  fs.statSync(path.resolve(__dirname, inputFilePath))
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Error: Input file "${inputFilePath}" is not found.`)
  } else {
    console.error(
      `Error: An error occured in checking "${inputFilePath}" file.`
    )
  }
  throw err
}

// アップロード
;(async () => {
  // サインイン
  const res = await signInForBatch()
  const data = res.result as SignInSuccessResult

  // アップロード処理
  const file = fs.readFileSync(path.resolve(__dirname, inputFilePath))
  const formData = new FormData()
  formData.append('file', new Blob([new Uint8Array(file)]))
  const result = await fetch(baseURL + '/saying/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${data.accessToken}`
    }
  })
  console.log(result)
  console.log('Success!!')
  return true
})()
