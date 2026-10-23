import type { ApiResponse } from '../..'

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

//API側で受け取った時のDTO（Pipeで上に変換する）
// TODO pipe作るたびにこれ再定義するのめんどい　なんかOmitみたいなtypescriptで楽に定義できる方法ないか？
export interface EditQuizAPIRequestReceivedDto {
  quiz_id: string
  file_num: string
  quiz_num: string
  format_id?: string
  question?: string
  answer?: string
  category?: string
  img_file?: string
  matched_basic_quiz_id?: string
  dummyChoice?: string
  explanation?: string // 解説
}

// 問題編集APIのレスポンス（更新後の問題）
export interface EditQuizApiResponseDto extends ApiResponse {
  id: number
  file_num: number
  quiz_num: number
  format_id: number
  quiz_sentense: string
  answer: string
  img_file: string | null
  checked: boolean | null
}
