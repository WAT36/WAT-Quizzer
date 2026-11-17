import { z } from 'zod'
import { requiredQueryIdSchema } from '../../../schema'

// 問題ファイルCSVダウンロードAPIのクエリ
export const downloadQuizCsvAPIRequestSchema = z.object({
  file_num: requiredQueryIdSchema
})
