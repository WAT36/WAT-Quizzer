import type { z } from 'zod'
import type { searchWordAPIRequestSchema } from './schema'
import type { ApiResponse } from '../../..'

// 英単語検索APIリクエスト型
export type SearchWordAPIRequestDto = z.infer<typeof searchWordAPIRequestSchema>

// 英単語検索APIレスポンス型
export interface SearchWordAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    meaning: string
  }[]
}
