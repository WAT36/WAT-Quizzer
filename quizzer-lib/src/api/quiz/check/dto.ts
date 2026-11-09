// 問題にチェックを付ける・外すAPIリクエスト型
export interface CheckQuizAPIRequestDto {
  quiz_ids: number[] // 問題のID(quiz.id)
}

// 問題のチェック反転APIリクエスト型
export interface ReverseCheckQuizAPIRequestDto {
  quiz_id: number // 問題のID(quiz.id)
}
