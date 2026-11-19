import { z } from 'zod'
import { idSchema } from '../../../schema'

const httpUrlSchema = z.url({
  protocol: /^https?$/,
  error: 'http(s)のURLを指定してください'
})

// 候補の画像をダウンロードして保存し、問題に紐付けるAPIのリクエスト
export const importImageOfQuizAPIRequestSchema = z.object({
  quiz_id: idSchema, // 問題のID(quiz.id)
  image_url: httpUrlSchema, // 候補の元画像のURL
  thumbnail_url: httpUrlSchema.nullable(), // 候補のサムネイルのURL
  signature: z.string().min(1) // 候補取得APIが付けた署名
})
