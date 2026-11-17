import { z } from 'zod'
import { queryIdSchema } from '../../../schema'

// 問題ファイル統計取得APIのクエリ（file_num未指定・-1なら全ファイル合計）
export const getQuizFileStatisticsAPIRequestSchema = z.object({
  file_num: queryIdSchema.default(-1)
})
