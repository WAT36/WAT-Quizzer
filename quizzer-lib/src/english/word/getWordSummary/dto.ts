import { ApiResponse } from '../../../api'

// word_summarizeからの取得結果
export interface WordSummaryApiResponse extends ApiResponse {
  name: string
  count: number
}
