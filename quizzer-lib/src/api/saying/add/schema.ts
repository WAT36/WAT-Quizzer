import { z } from 'zod'
import { idSchema } from '../../schema'

// 格言本文（DBの列はVARCHAR(256)）
export const sayingTextSchema = z
  .string()
  .min(1, '格言を入力してください')
  .max(256, '格言は256文字以内で入力してください')

// 格言追加APIのリクエスト
export const addSayingAPIRequestSchema = z.object({
  book_id: idSchema,
  saying: sayingTextSchema,
  explanation: z.string() // 格言の説明（空でもよい）
})
