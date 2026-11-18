import { z } from 'zod'
import {
  queryBooleanSchema,
  queryCountSchema,
  queryFormatIdsSchema,
  queryIdSchema,
  queryRateSchema,
  queryStringSchema,
  requiredQueryIdSchema
} from '../../schema'

// 問題取得APIのクエリ（番号指定・ランダム・最低正解率などの出題方法で共通）
export const getQuizAPIRequestSchema = z
  .object({
    file_num: requiredQueryIdSchema,
    quiz_num: queryIdSchema, // 番号指定で取得する時のみ（未選択は-1）
    format_id: queryFormatIdsSchema, // カンマ区切りの問題形式ID
    min_rate: queryRateSchema, // 正解率(%)の範囲
    max_rate: queryRateSchema,
    category: queryStringSchema, // カンマ区切りのカテゴリ名（未選択は-1）
    checked: queryBooleanSchema, // trueならチェック済みの問題のみ
    keyword: z.string().optional(), // 問題文・答え（または解説）のキーワード
    keywordTarget: z.enum(['sentence_answer', 'explanation']).optional(),
    count: queryIdSchema, // 指定した場合、条件に合う問題を最大count件まとめて取得する
    min_answer_count: queryCountSchema, // これまでの回答数(正解+不正解)の範囲（〜回以上）
    max_answer_count: queryCountSchema // （〜回以下）
  })
  .refine(
    (x) =>
      x.min_answer_count === undefined ||
      x.max_answer_count === undefined ||
      x.min_answer_count <= x.max_answer_count,
    {
      message: '回答数の範囲は「以上」を「以下」以下の値にしてください',
      path: ['min_answer_count']
    }
  )
