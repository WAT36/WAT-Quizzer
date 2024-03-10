// 問題ファイル追加APIリクエスト型
export interface AddQuizFileAPIRequestDto {
  file_name: string
  file_nickname: string
}

// 問題ファイル削除APIリクエスト型
export interface DeleteQuizFileAPIRequestDto {
  file_id: number
}
