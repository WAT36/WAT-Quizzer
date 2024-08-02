import { ApiResponse } from '../../../..'

// 英単語ランダム取得APIレスポンス型
export interface GetRandomWordAPIResponse extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    meaning: string
    partsofspeech: {
      name: string
    }
  }[]
  word_source: {
    source: {
      name: string
    }
  }[]
}
