// 英単語意味編集APIリクエスト型
export interface EditWordMeanAPIRequestDto {
  wordId: number
  wordMeanId: number
  meanId: number
  partofspeechId: number
  meaning: string
}
