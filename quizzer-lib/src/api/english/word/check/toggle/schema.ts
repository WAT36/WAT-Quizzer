import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 単語チェック反転APIのリクエスト
export const toggleCheckAPIRequestSchema = z.object({
  wordId: idSchema
})
