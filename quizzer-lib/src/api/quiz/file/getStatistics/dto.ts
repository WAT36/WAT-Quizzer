import type { ApiResponse } from '../../..'

export interface GetQuizFileStatisticsAPIRequestDto {
  file_num?: number
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface GetQuizFileStatisticsAPIRequestReceivedDto {
  file_num: string
}

// quiz/file/statisticsからの取得結果
export interface QuizFileStatisticsApiResponse extends ApiResponse {
  file_num: number
  file_name: string
  file_nickname: string
  count: number
  clear: number
  fail: number
  not_answered: number
  accuracy_rate: number // TODO
  process_rate: number // TODO
}
