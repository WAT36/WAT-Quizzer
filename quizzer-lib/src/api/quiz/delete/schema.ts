import { z } from 'zod'
import { idSchema } from '../../schema'

// 問題削除APIのリクエスト（ファイル番号と問題番号で問題を指定する）
export const deleteQuizAPIRequestSchema = z.object({
  file_num: idSchema,
  quiz_num: idSchema
})
