import { ApiResponse } from '@/api'

// quiz/statistics/weekからの取得結果
export interface QuizStatisticsWeekApiResponse extends ApiResponse {
  date: string
  count: number
}
