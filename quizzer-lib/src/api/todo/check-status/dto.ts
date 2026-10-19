import type { ApiResponse } from '../..'

export interface GetTodoCheckStatusAPIRequestDto {
  date: string
}

export interface GetTodoCheckStatusApiResponseDto extends ApiResponse {
  completedTodoIds: number[]
}

export interface SaveTodoCheckStatusAPIRequestDto {
  date: string
  completedTodoIds: number[]
}

export interface SaveTodoCheckStatusApiResponseDto extends ApiResponse {
  userId: string
  date: string
  completedTodoIds: number[]
}
