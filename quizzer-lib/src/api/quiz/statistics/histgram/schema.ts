import { z } from 'zod'
import { queryIdSchema } from '../../../schema'

// 正答率ヒストグラム取得APIのクエリ（file_num未指定・-1なら全ファイル）
export const getAccuracyRateHistgramAPIRequestSchema = z.object({
  file_num: queryIdSchema.default(-1)
})
