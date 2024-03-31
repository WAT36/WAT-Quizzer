import { ApiResponse } from '../response'

// カテゴリ取得APIレスポンス型
export interface GetCategoryAPIResponseDto extends ApiResponse {
  file_num?: number
  category: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

// (指定ファイルのカテゴリ毎の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateByCategorySqlResultDto extends ApiResponse {
  file_num: number
  c_category: string
  count: number
  accuracy_rate: number
}

// (指定ファイルのチェック済の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateOfCheckedQuizSqlResultDto extends ApiResponse {
  checked: boolean
  count: number
  sum_clear: number
  sum_fail: number
  accuracy_rate: number
}

// カテゴリ正解率取得API 返り値DTO
export interface GetAccuracyRateByCategoryAPIResponseDto {
  result: AccuracyRateByCategorySqlResultDto[]
  checked_result: AccuracyRateOfCheckedQuizSqlResultDto[]
}
