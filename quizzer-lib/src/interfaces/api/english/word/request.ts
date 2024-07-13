// 追加する英単語のデータ
export interface EnglishWordDataDto {
  partOfSpeechId: number
  meaning: string
  partOfSpeechName?: string
}

// 英単語追加APIリクエスト型
export interface AddEnglishWordAPIRequestDto {
  inputWord: {
    wordName: string
    sourceId: number
    newSourceName?: string
    subSourceName: string
  }
  pronounce: string
  meanArrayData: EnglishWordDataDto[]
}

//  英単語テスト結果追加リクエスト型
export interface AddWordTestResultLogAPIRequestDto {
  wordId: number
  testType: number
}

// 英単語追加画面で入力した単語、意味のデータを　英単語追加APIに送るためのデータ型
export interface SendToAddWordApiData {
  partOfSpeechId: number
  meaning: string
  partOfSpeechName?: string
}
