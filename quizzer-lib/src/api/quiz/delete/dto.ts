// 問題削除APIリクエスト型（ファイル番号と問題番号で問題を指定する）
export interface DeleteQuizAPIRequestDto {
  file_num: number
  quiz_num: number
}
