import type { ApiResponse } from '../..'

export interface AddTodoDiaryAPIRequestDto {
  date: string
}

export interface AddTodoDiaryApiResponseDto extends ApiResponse {
  id: number
  date: string
  completed: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
