import { z } from 'zod'
import { idOrNewSchema, idSchema } from '../../../../schema'

// 英単語出典編集APIのリクエスト
export const editWordSourceAPIRequestSchema = z.object({
  id: idOrNewSchema, // word_sourceのid（-1は新規追加）
  wordId: idSchema,
  sourceId: idSchema
})
