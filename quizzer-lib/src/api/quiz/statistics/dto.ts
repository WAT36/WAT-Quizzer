import type { ApiResponse } from '../..'

export type DateUnit = 'day' | 'week' | 'month'

export interface GetAnswerLogStatisticsAPIRequestDto {
  file_num?: number
  date_unit?: DateUnit
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface GetAnswerLogStatisticsAPIRequestReceivedDto {
  file_num: string
  date_unit: DateUnit
}

// quiz/statisticsからの取得結果
export interface AnswerLogStatisticsApiResponse extends ApiResponse {
  date: string
  count: number
  accuracy_rate: number
}
