// 英単語追加APIリクエスト型
export interface AddWordAPIRequestDto {
  inputWord: {
    wordName: string
    sourceId: number
    newSourceName?: string // 出典がその他の場合必要
    subSourceName: string
  }
  pronounce: string
  meanArrayData: {
    partOfSpeechId: number
    meaning: string
    partOfSpeechName?: string // 品詞がその他の場合必要
  }[]
}
