import type { ApiResponse } from '../..'

export interface RestoreTodoAPIRequestDto {
  id: number
}

export interface RestoreTodoApiResponseDto extends ApiResponse {
  id: number
  todo: string
  deleted_at: null
}
