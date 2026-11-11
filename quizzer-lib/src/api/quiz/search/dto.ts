import type { ApiResponse, QueryReceivedDto } from '../..'

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

// API側で受け取った時のDTO（Pipeで上に変換する）
// カテゴリ条件(category_and,category_not)はJSON文字列化した配列で受け取る
export type SearchQuizAPIRequestReceivedDto =
  QueryReceivedDto<SearchQuizAPIRequestDto>

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
