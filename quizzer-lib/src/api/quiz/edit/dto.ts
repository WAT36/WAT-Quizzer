import type { QuizApiResponseDto } from '../dto'

export interface EditQuizAPIRequestDto {
  quiz_id: number
  file_num: number
  quiz_num: number
  format_id?: number
  question?: string
  answer?: string
  category?: string
  img_file?: string
  matched_basic_quiz_id?: string
  // 四択問題(format_id=3)の場合のみ。登録済みのダミー選択肢と同じ件数(常に3件)・id昇順で送る
  dummyChoice?: {
    sentense: string
    isCorrect: boolean
  }[]
  explanation?: string // 解説
}

// 問題編集APIのレスポンス（更新後の問題）
export type EditQuizApiResponseDto = QuizApiResponseDto
