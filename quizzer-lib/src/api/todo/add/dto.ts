import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type { addTodoAPIRequestSchema } from './schema'

export type AddTodoAPIRequestDto = z.infer<typeof addTodoAPIRequestSchema>

export interface AddTodoApiResponseDto extends ApiResponse {
  id: number
  todo: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
