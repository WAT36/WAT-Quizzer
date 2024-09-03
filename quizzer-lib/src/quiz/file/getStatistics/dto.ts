import { ApiResponse } from '../../../..'

// quiz/file/statisticsからの取得結果
export interface QuizFileStatisticsApiResponse extends ApiResponse {
  basic_quiz_count: number
  advanced_quiz_count: number
  file_num: number
  file_name: string
  file_nickname: string
  basic_clear: number
  basic_fail: number
  basic_accuracy_rate: bigint
  advanced_clear: number
  advanced_fail: number
  advanced_accuracy_rate: bigint
}
