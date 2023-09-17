import { ApiResponse } from './api'

// categoryからの取得結果
export interface CategoryApiResponse extends ApiResponse {
  file_num: number
  category: string
  created_at: string
  updated_at: string
  deleted_at: string | undefined
}
