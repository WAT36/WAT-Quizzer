import type { ApiResponse } from '..'

// 問題を更新・操作するAPIが返す問題データ（更新後の状態）
export interface QuizApiResponseDto extends ApiResponse {
  id: number
  file_num: number
  quiz_num: number
  format_id: number
  quiz_sentense: string
  answer: string
  img_file: string | null
  checked: boolean | null
}

// 有効なカテゴリ付きの問題データ
export interface QuizWithCategoryApiResponseDto extends QuizApiResponseDto {
  category_quiz: {
    category: {
      name: string
    }
  }[]
}
