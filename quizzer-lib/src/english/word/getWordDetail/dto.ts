import { ApiResponse } from '../../../..'

// 英単語詳細取得APIレスポンス型
export interface GetWordDetailAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    partsofspeech: {
      id: number
      name: string
    }
    id: number
    wordmean_id: number
    meaning: string
  }[]
  word_source: {
    source: {
      id: number
      name: string
    }
  }[]
  word_subsource: {
    id: number
    subsource: string
    created_at: string
  }[]
}
