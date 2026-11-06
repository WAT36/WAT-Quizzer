export interface GetCategoryRateAPIRequestDto {
  file_num: number
  startDate?: string
  endDate?: string
  format_id?: { [key: string]: boolean }
}

// (指定ファイルのカテゴリ毎の)正解率
export interface AccuracyRateByCategoryDto {
  file_num: number
  category: string
  count: number
  accuracy_rate: number
}

// (指定ファイルの全問題の)正解率
export interface AccuracyRateSummaryDto {
  count: number
  sum_clear: number
  sum_fail: number
  accuracy_rate: number
}

// (指定ファイルのチェック済の問題の)正解率
export interface AccuracyRateOfCheckedQuizDto extends AccuracyRateSummaryDto {
  checked: boolean
}

// カテゴリ正解率取得API 返り値DTO
export interface GetAccuracyRateByCategoryAPIResponseDto {
  result: AccuracyRateByCategoryDto[]
  checked_result: AccuracyRateOfCheckedQuizDto[]
  all_result: AccuracyRateSummaryDto[]
}
