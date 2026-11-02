// 英単語出典編集APIリクエスト型
export interface EditWordSourceAPIRequestDto {
  // word_sourceのid（-1は新規追加）
  id: number
  wordId: number
  sourceId: number
}
