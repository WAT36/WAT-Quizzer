// TODO file_num,quiz_num,format_idはいる？そもそもanswer_logにいらない説
export type ClearQuizAPIRequestDto = {
  quiz_id: number
  file_num: number
  quiz_num: number
  format_id: number
}
