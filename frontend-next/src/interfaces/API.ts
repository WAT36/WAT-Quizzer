export interface ImageUploadReturnValue {
  name: string;
  isUploading: boolean;
  url: string;
}

// APIから受け取ったデータを変換しフロント側で処理する型
export interface ProcessingApiReponse {
  status: number;
  body: ApiResponse[];
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}

// quiz_fileからの取得結果
export interface QuizFileApiResponse extends ApiResponse {
  file_num: number;
  file_name: string;
  file_nickname: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// quizからの取得結果
export interface QuizApiResponse extends ApiResponse {
  id: number;
  file_num: number;
  quiz_num: number;
  quiz_sentense: string;
  answer: string;
  category: string | undefined;
  img_file: string | undefined;
  checked: boolean | undefined;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// quiz_viewからの取得結果(正解数、不正解数、正解率など)
export interface QuizViewApiResponse extends ApiResponse {
  file_num: number;
  quiz_num: number;
  quiz_sentense: string;
  answer: string;
  category: string | undefined;
  img_file: string | undefined;
  checked: boolean | undefined;
  clear_count: number;
  fail_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
  accuracy_rate: number;
}

// categoryからの取得結果
export interface CategoryApiResponse extends ApiResponse {
  file_num: number;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// 問題追加APIの返り値の型
export interface AddQuizApiResponse extends ApiResponse {
  result: string;
}

// 問題チェックAPIの返り値の型
export interface CheckQuizApiResponse extends ApiResponse {
  result: boolean;
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
export interface GetAccuracyRateByCategoryServiceDto extends ApiResponse {
  result: AccuracyRateByCategorySqlResultDto[];
  checked_result: AccuracyRateOfCheckedQuizSqlResultDto[];
}
