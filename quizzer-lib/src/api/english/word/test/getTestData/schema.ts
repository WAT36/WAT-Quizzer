import { z } from 'zod'
import {
  queryBooleanSchema,
  queryDateSchema,
  queryIdSchema,
  queryRateSchema
} from '../../../../schema'

// 英単語テストデータ取得APIのクエリ
export const getEnglishWordTestDataAPIRequestSchema = z.object({
  format: z.enum(['random', 'lru', 'review']), // 出題形式
  source: queryIdSchema, // 出典ID（未選択は-1）
  checked: queryBooleanSchema, // trueならチェック済みの単語のみ
  startDate: queryDateSchema, // 最終解答日の範囲
  endDate: queryDateSchema,
  min_rate: queryRateSchema, // 正解率(%)の範囲
  max_rate: queryRateSchema,
  result_from: queryIdSchema, // 条件に合う単語のうち、x件目からy件目までに絞る
  result_to: queryIdSchema,
  word_type: z.enum(['all', 'word', 'phrase']).optional()
})

// API側でクエリを検証・変換した後のDTO
export type GetEnglishWordTestDataAPIRequestParsedDto = z.output<
  typeof getEnglishWordTestDataAPIRequestSchema
>
