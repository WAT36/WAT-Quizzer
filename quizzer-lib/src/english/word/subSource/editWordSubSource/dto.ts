// 英単語サブ出典追加更新APIリクエスト型
export interface EditWordSubSourceAPIRequestDto {
  id: number
  wordId: number
  subSource: string
}
