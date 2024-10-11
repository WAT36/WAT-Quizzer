import { ApiResponse } from '../../../api'

// quiz/file/statisticsからの取得結果
export interface QuizFileStatisticsApiResponse extends ApiResponse {
  file_num: number
  file_name: string
  file_nickname: string
  count: number
  clear: number
  fail: number
  accuracy_rate: bigint
}
