import { ApiResponse } from '../../../..'

// 例文検索APIリクエスト型
export interface SearchExampleAPIRequestDto {
  query: string
  isLinked: string
}

// 例文検索APIレスポンス型
export interface SearchExampleAPIResponseDto extends ApiResponse {
  id: number
  en_example_sentense: string
  ja_example_sentense: string
}
