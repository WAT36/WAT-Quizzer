import { ApiResponse } from '@/api'

// 格言検索リクエスト型
export interface SearchSayingAPIRequestDto {
  saying: string
}

export interface SearchSayingAPIResponseDto extends ApiResponse {
  id: number
  saying: string
  explanation: string
  selfhelp_book: {
    name: string
  }
}
