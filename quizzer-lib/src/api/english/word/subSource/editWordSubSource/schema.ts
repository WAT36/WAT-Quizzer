import { z } from 'zod'
import { idOrNewSchema, idSchema } from '../../../../schema'

// 英単語サブ出典追加更新APIのリクエスト
export const editWordSubSourceAPIRequestSchema = z.object({
  id: idOrNewSchema, // word_subsourceのid（-1は新規追加）
  wordId: idSchema,
  subSource: z.string().min(1, 'サブ出典を入力してください')
})
