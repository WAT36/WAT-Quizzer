import { ApiResponse } from '../../..'

export interface AddQuizAPIRequestDto {
  // TODO 基礎応用問題統合したら　このvalueは削除する？
  value: number

  //queryOfAddQuizState: QueryOfPutQuizState;
  file_num: number
  quiz_num: number
  format?: string
  formatValue?: number
  question?: string
  answer?: string
  quiz_category?: string
  img_file?: string
  matched_basic_quiz_id?: string
  dummy1?: string //四択問題のダミー選択肢１
  dummy2?: string //四択問題のダミー選択肢２
  dummy3?: string //四択問題のダミー選択肢３
  explanation?: string // 解説
}

// 問題追加APIのレスポンス（ログだけ）
export interface AddQuizApiResponseDto extends ApiResponse {
  log: string
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
}
