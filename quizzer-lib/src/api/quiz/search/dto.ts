import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type {
  searchQuizAPIRequestSchema,
  searchQuizRequestDataSchema
} from './schema'

// 問題検索画面の検索条件（APIにはクエリ文字列にして送る）
export type SearchQuizAPIRequestDto = z.output<typeof searchQuizRequestDataSchema>

// API側でクエリを検証・変換した後のDTO
export type SearchQuizAPIRequestParsedDto = z.output<typeof searchQuizAPIRequestSchema>

// 問題検索APIのレスポンスの1件分
export interface SearchQuizResultDto extends ApiResponse {
  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  img_file?: string
  checked?: boolean
  quiz_format: {
    name: string
  }
  quiz_statistics_view: {
    accuracy_rate: number
  }
  // 削除済みを除いた、問題に紐付くカテゴリ名
  quiz_category: {
    category: string
  }[]
  quiz_explanation?: {
    explanation: string
  }
}
