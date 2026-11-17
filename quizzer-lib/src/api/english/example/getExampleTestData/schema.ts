import { z } from 'zod'
import { queryIdSchema } from '../../../schema'

// 例文テストデータ取得APIのクエリ（出典が未指定・-1(選択なし)なら全出典から出題）
export const getExampleTestDataAPIRequestSchema = z.object({
  sourceId: queryIdSchema
})
