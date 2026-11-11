import type { ApiResponse, QueryReceivedDto } from '../..'

// キーワード検索の対象（問題文・解答 or 解説のどちらか一方）
export type KeywordSearchTarget = 'sentence_answer' | 'explanation'

// 問題取得の方法（未指定時は番号指定で1問取得）
export type GetQuizMethod =
  | 'random'
  | 'worstRate'
  | 'leastClear'
  | 'LRU'
  | 'review'
  | 'todayNotAnswered'
  | 'recentlyUpdated'

export interface GetQuizAPIRequestDto {
  file_num: number
  quiz_num?: number
  format_id?: { [key: string]: boolean }
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: boolean
  keyword?: string
  keywordTarget?: KeywordSearchTarget
  count?: number // 指定した場合、method指定時に条件に合う問題を最大count件まとめて取得する
}

// API側で受け取った時のDTO（Pipeで上に変換する）
export type GetQuizAPIRequestReceivedDto =
  QueryReceivedDto<GetQuizAPIRequestDto>

// 問題取得APIのレスポンス
// DBの値をバックエンドで変換して返す（カテゴリ名の配列化・統計値の数値化など）ため、Prismaの型ではなくAPIの形で定義する
export interface GetQuizApiResponseDto extends ApiResponse {
  count?: number
  format_id?: number

  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  img_file?: string
  checked?: boolean
  quiz_statistics_view?: {
    clear_count?: number
    fail_count?: number
    accuracy_rate: number
  }
  // 削除済みを除いた、問題に紐付くカテゴリ名
  quiz_category?: {
    category: string
  }[]
  quiz_dummy_choice?: {
    dummy_choice_sentense: string
    is_corrected: boolean
  }[]
  quiz_basis_linkage?: {
    basis_quiz_id: number
    advanced_quiz_id: number
  }[]
  quiz_advanced_linkage?: {
    basis_quiz_id: number
    advanced_quiz_id: number
  }[]
  quiz_explanation?: {
    explanation: string
  }
}
