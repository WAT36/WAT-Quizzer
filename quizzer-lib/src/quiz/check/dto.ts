// TODO numberにできるところはそうしたい
// TODO GetQuiz　とプロパティ名揃えて
export interface CheckQuizAPIRequestDto {
  file_num: number
  quiz_num: string // カンマ区切りで複数指定も可能
}
