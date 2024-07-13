import { ApiResponse } from '../../../..'

// 英単語検索APIリクエスト型
export interface SearchWordAPIRequestDto {
  wordName?: string
  meanQuery?: string
  subSourceName?: string
}

// 英単語検索APIレスポンス型
export interface SearchWordAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    meaning: string
  }[]
}
