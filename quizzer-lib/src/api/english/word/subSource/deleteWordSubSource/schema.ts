import { z } from 'zod'
import { selectedIdSchema } from '../../../../schema'

// 英単語サブ出典削除APIのリクエスト
export const deleteWordSubSourceAPIRequestSchema = z.object({
  id: selectedIdSchema('サブ出典を入力してください') // word_subsourceのid
})
