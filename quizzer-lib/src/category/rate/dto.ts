import { ApiResponse } from '@/api'

// TODO category/listのDTOと共通化
export interface GetCategoryRateAPIRequestDto {
  file_num: number
}

// TODO とりあえずそのまま持ってきたが作り替えたい
// (指定ファイルのカテゴリ毎の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateByCategorySqlResultDto extends ApiResponse {
  file_num: number
  category: string
  count: bigint
  accuracy_rate: number
}

// (指定ファイルのチェック済の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateOfCheckedQuizSqlResultDto extends ApiResponse {
  checked: boolean
  count: bigint
  sum_clear: number
  sum_fail: number
  accuracy_rate: number
}

// カテゴリ正解率取得API 返り値DTO
export interface GetAccuracyRateByCategoryAPIResponseDto {
  result: AccuracyRateByCategorySqlResultDto[]
  checked_result: AccuracyRateOfCheckedQuizSqlResultDto[]
}
