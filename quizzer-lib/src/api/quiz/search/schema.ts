import { z } from 'zod'
import {
  queryBooleanSchema,
  queryFormatIdsSchema,
  queryIdSchema,
  queryRateSchema,
  requiredQueryIdSchema
} from '../../schema'

// カテゴリ条件（カテゴリ名にカンマが含まれ得るため、配列をJSON文字列化して送られてくる）
// 前後の空白を除き、空文字と重複を除く。条件がなければundefined
const queryCategoryListSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (value === undefined) return undefined
    let parsed: unknown
    try {
      parsed = JSON.parse(value)
    } catch {
      parsed = undefined
    }
    if (
      !Array.isArray(parsed) ||
      !parsed.every((x): x is string => typeof x === 'string')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'カテゴリ条件はカテゴリ名の配列をJSON文字列にして指定してください'
      })
      return z.NEVER
    }
    const categories = Array.from(
      new Set(parsed.map((x) => x.trim()).filter((x) => x !== ''))
    )
    return categories.length > 0 ? categories : undefined
  })

// 問題検索APIのクエリ
export const searchQuizAPIRequestSchema = z.object({
  query: z.string().default(''), // 検索キーワード
  file_num: requiredQueryIdSchema,
  format_id: queryFormatIdsSchema, // カンマ区切りの問題形式ID
  min_rate: queryRateSchema, // 正解率(%)の範囲
  max_rate: queryRateSchema,
  category_and: queryCategoryListSchema, // 全て付いている問題
  category_not: queryCategoryListSchema, // どれも付いていない問題
  checked: queryBooleanSchema,
  searchInOnlySentense: queryBooleanSchema,
  searchInOnlyAnswer: queryBooleanSchema,
  searchInExplanation: queryBooleanSchema,
  onlyDirectCategory: queryBooleanSchema,
  result_from: queryIdSchema, // 検索結果のx件目からy件目までに絞る
  result_to: queryIdSchema
})
