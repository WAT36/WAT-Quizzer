export interface IntegrateToQuizAPIRequestDto {
  file_num: number
  fromQuizInfo: {
    quiz_num: number
  }
  toQuizInfo: {
    quiz_num: number
  }
}
