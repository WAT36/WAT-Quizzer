import { ApiResponse } from '../../..'

// TODO numberにできるところはそうしたい
export interface GetQuizAPIRequestDto {
  file_num: number
  quiz_num?: number
  format: string
  min_rate?: string
  max_rate?: string
  category?: string
  checked?: string //booleanにしたい
}

// 問題取得APIのレスポンス（基礎応用込み）、フォーマット込み
export interface GetQuizApiResponseDto extends ApiResponse {
  format: string
  //formatValue: string

  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  img_file?: string
  checked?: boolean
  quiz_statistics_view?: {
    clear_count: number
    fail_count: number
    accuracy_rate: number
  }
  quiz_category?: {
    category: string
    deleted_at?: string
  }[]
  advanced_quiz_statistics_view?: {
    clear_count: number
    fail_count: number
    accuracy_rate: number
  }
  dummy_choice?: {
    dummy_choice_sentense: string // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
  }[]
  advanced_quiz_explanation?: {
    explanation: string
  }
  quiz_basis_advanced_linkage?: {
    basis_quiz_id: number
  }[]
}
