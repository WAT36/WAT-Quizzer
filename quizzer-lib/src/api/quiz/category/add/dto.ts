export interface AddCategoryToQuizAPIRequestDto {
  quiz_ids: number[] // 問題のID(quiz.id)
  category: string
}
