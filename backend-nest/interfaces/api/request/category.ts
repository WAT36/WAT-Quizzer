export interface SelectFileDto {
  file_num: number;
}

// (ファイル毎の)カテゴリ名が入ったDTO(SQL実行結果)
export interface CategoryByFileSqlResultDto {
  category: string;
}

// (指定ファイルのカテゴリ毎の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateByCategorySqlResultDto {
  file_num: number;
  c_category: string;
  count: number;
  accuracy_rate: number;
}

// (指定ファイルのチェック済の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateOfCheckedQuizSqlResultDto {
  checked: boolean;
  count: number;
  sum_clear: number;
  sum_fail: number;
  accuracy_rate: number;
}

// カテゴリ正解率取得API 返り値DTO
export interface GetAccuracyRateByCategoryServiceDto {
  result: AccuracyRateByCategorySqlResultDto[];
  checked_result: AccuracyRateOfCheckedQuizSqlResultDto[];
}
