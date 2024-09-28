// 問題削除APIリクエスト型
export interface DeleteQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
}

// 問題統合APIリクエスト型
export interface IntegrateQuizAPIRequestDto {
  pre_file_num: number
  pre_quiz_num: number
  post_file_num: number
  post_quiz_num: number
}

// クイズにカテゴリを追加するAPIリクエスト型
export interface UpdateCategoryOfQuizAPIRequestDto {
  file_num: number
  quiz_num: number
  category: string
}

// クイズからカテゴリを削除するAPIリクエスト型
export interface RemoveCategoryOfQuizAPIRequestDto {
  file_num: number
  quiz_num: number
  category: string
}

// 問題ファイル削除系APIリクエスト型
export interface DeleteAnswerLogAPIRequestDto {
  file_id: number
}
