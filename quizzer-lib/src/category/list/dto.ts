import { ApiResponse } from '@/api'

export interface GetCategoryListAPIRequestDto {
  file_num: string
}

// カテゴリ取得APIレスポンス型
export interface GetCategoryAPIResponseDto extends ApiResponse {
  file_num?: number
  category: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}
