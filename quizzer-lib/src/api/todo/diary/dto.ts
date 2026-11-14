import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type { addTodoDiaryAPIRequestSchema } from './schema'

export type AddTodoDiaryAPIRequestDto = z.infer<
  typeof addTodoDiaryAPIRequestSchema
>

export interface AddTodoDiaryApiResponseDto extends ApiResponse {
  id: number
  date: string
  completed: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
