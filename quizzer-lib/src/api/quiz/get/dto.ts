import { ApiResponse } from '../..'

// キーワード検索の対象（問題文・解答 or 解説のどちらか一方）
export type KeywordSearchTarget = 'sentence_answer' | 'explanation'

export interface GetQuizAPIRequestDto {
  file_num: number
  quiz_num?: number
  format_id?: { [key: string]: boolean }
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: boolean //booleanにしたい
  keyword?: string
  keywordTarget?: KeywordSearchTarget
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface GetQuizAPIRequestReceivedDto {
  file_num: string
  quiz_num?: string
  format_id?: string
  min_rate?: string
  max_rate?: string
  category?: string
  checked?: string //booleanにしたい
  keyword?: string
  keywordTarget?: string
}

// 問題取得APIのレスポンス（基礎応用込み）、フォーマット込み
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
  quiz_format?: {
    name: string
  }
  quiz_statistics_view?: {
    clear_count?: number
    fail_count?: number
    accuracy_rate: number
  }
  quiz_category?: {
    // TODO 一個ずつ型定義ではなく　index.d.tsから型取ってきてそれを使うようにしたい　でないとDB定義変えるたびにここも変える必要ありで面倒
    category: string
    deleted_at?: string
  }[]
  quiz_dummy_choice?: {
    dummy_choice_sentense: string // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
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
  quiz_basis_advanced_linkage?: {
    basis_quiz_id: number
  }[]
}
