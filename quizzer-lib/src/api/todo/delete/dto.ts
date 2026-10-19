import type { ApiResponse } from '../..'

export interface DeleteTodoAPIRequestDto {
  id: number
}

export interface DeleteTodoApiResponseDto extends ApiResponse {
  id: number
  todo: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}
