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

// 英単語意味編集APIリクエスト型
export interface EditWordMeanAPIRequestDto {
  wordId: number
  wordMeanId: number
  meanId: number
  partofspeechId: number
  meaning: string
}

// TODO 以下は書き換えたい
// 英単語追加画面で利用する、入力した単語の意味のデータ型
export interface meanOfAddWordDto {
  pos: {
    id: number
    name?: string
  }
  mean: string | undefined
}

// 英単語追加画面で入力した単語、意味のデータを　英単語追加APIに送るためのデータ型
export interface SendToAddWordApiData {
  partOfSpeechId: number
  meaning: string
  partOfSpeechName?: string
}
