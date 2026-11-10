import type { ApiResponse, QueryReceivedDto } from '../../..'

export interface GetQuizFileStatisticsAPIRequestDto {
  file_num?: number
}

// API側で受け取った時のDTO（Pipeで上に変換する）
export type GetQuizFileStatisticsAPIRequestReceivedDto =
  QueryReceivedDto<GetQuizFileStatisticsAPIRequestDto>

// quiz/file/statisticsからの取得結果（file_num未指定なら全ファイル合計）
export interface QuizFileStatisticsApiResponse extends ApiResponse {
  file_num: number
  file_name: string
  file_nickname: string
  count: number
  clear: number
  fail: number
  not_answered: number
  accuracy_rate: number // 正答率(%) 正解回数÷(正解回数+不正解回数)、未解答のみなら0
  process_rate: number // 進捗率(%) 一度でも解答した問題の割合、問題が0件なら0
}
