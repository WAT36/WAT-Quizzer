import type { ApiResponse } from '../../..'

// source/statisticsからの取得結果
// TODO これ類 prismaの型(index.d.gs)から取ってこれるんでない？
export interface SourceStatisticsApiResponse extends ApiResponse {
  id: number
  name: string
  clear_count: number
  fail_count: number
  count: number
  not_answered: number
  accuracy_rate: number // TODO
}
