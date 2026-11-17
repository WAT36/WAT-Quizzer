import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type { searchQuizAPIRequestSchema } from './schema'

export interface SearchQuizAPIRequestDto {
  query: string
  file_num: number
  format_id?: { [key: string]: boolean }
  min_rate?: number
  max_rate?: number
  category_and?: string[]
  category_not?: string[]
  checked?: boolean
  searchInOnlySentense?: boolean
  searchInOnlyAnswer?: boolean
  searchInExplanation?: boolean
  onlyDirectCategory?: boolean
  result_from?: number
  result_to?: number
}

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
