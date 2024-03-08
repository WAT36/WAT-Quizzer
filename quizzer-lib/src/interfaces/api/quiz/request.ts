// 問題正解登録APIリクエスト型
export interface ClearQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
}

// 問題正解登録APIリクエスト型
export interface FailQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
}

// 問題追加APIリクエスト型
export interface AddQuizAPIRequestDto {
  file_num: number
  input_data: {
    question?: string
    answer?: string
    category?: string
    img_file?: string
    matched_basic_quiz_id?: string
    dummy1?: string //四択問題のダミー選択肢１
    dummy2?: string //四択問題のダミー選択肢２
    dummy3?: string //四択問題のダミー選択肢３
  }
}

// 問題編集APIリクエスト型
export interface EditQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
  question?: string
  answer?: string
  category?: string
  img_file?: string
  matched_basic_quiz_id?: string
  dummy1?: string //四択問題のダミー選択肢１
  dummy2?: string //四択問題のダミー選択肢２
  dummy3?: string //四択問題のダミー選択肢３
  explanation?: string //解説
}

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

// 問題へのチェック操作系APIリクエスト型
export interface CheckQuizAPIRequestDto {
  format: string // TODO number, format_idを使いたい
  file_num: number
  quiz_num: number
}

// 問題ファイル削除系APIリクエスト型
export interface DeleteQuizFileAPIRequestDto {
  file_id: number
}
