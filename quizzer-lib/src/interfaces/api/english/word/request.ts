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

//  英単語テスト結果追加リクエスト型
export interface AddWordTestResultLogAPIRequestDto {
  wordId: number
}

// 英単語出典編集APIリクエスト型
export interface EditWordSourceAPIRequestDto {
  meanId: number[]
  oldSourceId: number
  newSourceId: number
}

// 英単語サブ出典追加APIリクエスト型
export interface AddWordSubSourceAPIRequestDto {
  wordId: number
  subSource: string
}
