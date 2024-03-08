// 問題取得APIのレスポンス（基礎応用込み）
export interface GetQuizApiResponseDto {
  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  category?: string
  img_file?: string
  checked?: boolean
  clear_count: number
  fail_count: number
  accuracy_rate: number
  dummy_choice_sentense?: string // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
  explanation?: string
  matched_basic_quiz_id?: string
}
