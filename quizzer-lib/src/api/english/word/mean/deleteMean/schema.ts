import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 英単語意味削除APIのリクエスト
export const deleteMeanAPIRequestSchema = z.object({
  meanId: idSchema
})
