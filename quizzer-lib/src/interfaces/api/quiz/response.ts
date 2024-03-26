import { ApiResponse } from '../response'

// 問題取得APIのレスポンス（基礎応用込み）
export interface GetQuizApiResponseDto extends ApiResponse {
  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  category?: string
  img_file?: string
  checked?: boolean
  clear_count: number
  fail_count: number
  accuracy_rate: number
  dummy_choice_sentense?: string // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
  explanation?: string
  matched_basic_quiz_id?: string
}

// 問題番号(のみ)を取得する用のDTO
export interface GetQuizNumResponseDto {
  quiz_num: number
}

// ID(のみ)を取得する用のDTO
export interface GetIdDto {
  id: number
}

// 応用問題IDと関連づけている基礎問題IDを取得する用のDTO
export interface GetLinkedBasisIdDto {
  id: number
  file_num: number
  quiz_num: number
  basis_quiz_id: number
}

/// TODO フロント側のbuttonAPIでの返り値型だが、、バック側と揃えた方が良い
// 問題追加APIの返り値の型
export interface AddQuizApiResponse extends ApiResponse {
  result: string
}

// 問題チェックAPIの返り値の型
export interface CheckQuizApiResponse extends ApiResponse {
  result: boolean
}
