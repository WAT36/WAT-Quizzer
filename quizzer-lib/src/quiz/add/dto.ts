import { ApiResponse } from '../../..'
import { EditQuizAPIRequestDto } from '../edit/dto'

export type AddQuizAPIRequestDto = Omit<EditQuizAPIRequestDto, 'quiz_num'>

// 問題追加APIのレスポンス（ログだけ）
export interface AddQuizApiResponseDto extends ApiResponse {
  log: string
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
}
