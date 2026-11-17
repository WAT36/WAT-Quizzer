import { z } from 'zod'
import { idSchema } from '../../../schema'

// 問題ファイル削除APIのリクエスト
export const deleteQuizFileApiRequestSchema = z.object({
  file_id: idSchema // ファイル番号
})
