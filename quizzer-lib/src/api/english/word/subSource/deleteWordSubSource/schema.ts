import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 英単語サブ出典削除APIのリクエスト
export const deleteWordSubSourceAPIRequestSchema = z.object({
  id: idSchema // word_subsourceのid
})
