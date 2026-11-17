import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 英単語出典削除APIのリクエスト
export const deleteWordSourceAPIRequestSchema = z.object({
  id: idSchema // word_sourceのid
})
