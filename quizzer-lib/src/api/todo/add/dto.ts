import type { ApiResponse } from '../..'

export interface AddTodoAPIRequestDto {
  todo: string
}

export interface AddTodoApiResponseDto extends ApiResponse {
  id: number
  todo: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
