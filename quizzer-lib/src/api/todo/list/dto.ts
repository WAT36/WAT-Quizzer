import type { ApiResponse } from '../..'

export interface GetTodoListApiResponseDto extends ApiResponse {
  id: number
  todo: string
  deleted_at?: string | null
}
