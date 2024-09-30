export interface AddCategoryToQuizAPIRequestDto {
  file_num: number
  quiz_num: string // 数値をカンマ区切りで表記、文字列の形で送る
  category: string
}
