// 問題正解登録APIリクエスト型
export interface ClearQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
}
