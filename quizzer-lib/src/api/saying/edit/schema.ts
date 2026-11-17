import { z } from 'zod'
import { idSchema } from '../../schema'
import { sayingTextSchema } from '../add/schema'

// 格言編集APIのリクエスト
export const editSayingAPIRequestSchema = z.object({
  id: idSchema, // 格言ID
  saying: sayingTextSchema,
  explanation: z.string().optional() // 格言の説明
})
