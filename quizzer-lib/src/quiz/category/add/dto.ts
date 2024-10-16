export interface AddCategoryToQuizAPIRequestDto {
  quiz_id: string // 数値をカンマ区切りで表記、文字列の形で送る
  category: string
}
