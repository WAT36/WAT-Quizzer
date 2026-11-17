import { z } from 'zod'
import { idOrNewSchema, idSchema, selectedIdSchema } from '../../../../schema'

// 英単語出典編集APIのリクエスト
export const editWordSourceAPIRequestSchema = z.object({
  id: idOrNewSchema, // word_sourceのid（-1は新規追加）
  wordId: idSchema,
  sourceId: selectedIdSchema('出典を選択してください')
})
