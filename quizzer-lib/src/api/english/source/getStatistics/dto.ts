import type { ApiResponse } from '../../..'

// source/statisticsからの取得結果
export interface SourceStatisticsApiResponse extends ApiResponse {
  id: number
  name: string
  clear_count: number
  fail_count: number
  count: number
  not_answered: number
  accuracy_rate: number // 正答率(%) 0〜100、未解答のみなら0
}
