import type { z } from 'zod'
import type { ApiResponse } from '../..'
import type { saveTodoCheckStatusAPIRequestSchema } from './schema'

export interface GetTodoCheckStatusAPIRequestDto {
  date: string
}

export interface GetTodoCheckStatusApiResponseDto extends ApiResponse {
  completedTodoIds: number[]
}

export type SaveTodoCheckStatusAPIRequestDto = z.infer<
  typeof saveTodoCheckStatusAPIRequestSchema
>

export interface SaveTodoCheckStatusApiResponseDto extends ApiResponse {
  userId: string
  date: string
  completedTodoIds: number[]
}
