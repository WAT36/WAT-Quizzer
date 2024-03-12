// 追加する英単語のデータ
export interface EnglishWordDataDto {
  partOfSpeechId: number
  sourceId: number
  meaning: string
  partOfSpeechName?: string
  sourceName?: string
}

// 英単語追加APIリクエスト型
export interface AddEnglishWordAPIRequestDto {
  wordName: string
  pronounce: string
  meanArrayData: EnglishWordDataDto[]
}
