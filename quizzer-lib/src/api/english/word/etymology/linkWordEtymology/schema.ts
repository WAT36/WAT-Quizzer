import { z } from 'zod'
import { selectedIdSchema } from '../../../../schema'

// 単語-語源紐付けAPIのリクエスト
export const linkWordEtymologyAPIRequestSchema = z.object({
  etymologyName: z.string().trim().min(1, '語源名を入力してください'),
  wordId: selectedIdSchema('追加する単語IDを入力してください')
})
