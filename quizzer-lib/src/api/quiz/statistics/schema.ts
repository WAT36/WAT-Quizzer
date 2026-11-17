import { z } from 'zod'
import { queryIdSchema } from '../../schema'

// 解答数統計取得APIのクエリ（file_num未指定・-1なら全ファイル、date_unit未指定なら日単位）
export const getAnswerLogStatisticsAPIRequestSchema = z.object({
  file_num: queryIdSchema.default(-1),
  date_unit: z.enum(['day', 'week', 'month']).default('day')
})
