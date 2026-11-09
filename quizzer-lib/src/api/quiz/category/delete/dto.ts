// クイズからカテゴリ削除APIリクエスト型
export interface DeleteCategoryOfQuizAPIRequestDto {
  quiz_ids: number[] // 問題のID(quiz.id)
  category: string
}
