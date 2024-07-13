// 英単語出典編集APIリクエスト型
export interface EditWordSourceAPIRequestDto {
  wordId: number
  oldSourceId: number
  newSourceId: number
}
