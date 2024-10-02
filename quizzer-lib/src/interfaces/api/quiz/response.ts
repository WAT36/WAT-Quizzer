import { ApiResponse } from '../response'

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
