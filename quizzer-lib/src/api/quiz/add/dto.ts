import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type { addQuizAPIRequestSchema } from './schema'

export type AddQuizAPIRequestDto = z.infer<typeof addQuizAPIRequestSchema>

// 問題追加APIのレスポンス（ログだけ）
export interface AddQuizApiResponseDto extends ApiResponse {
  log: string
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
}
