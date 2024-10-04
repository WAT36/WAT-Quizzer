import { ApiResponse } from '@/api'

// sourceからの取得結果
export interface SourceApiResponse extends ApiResponse {
  id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at: string | undefined
}
