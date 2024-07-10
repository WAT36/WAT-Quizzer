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

// 英単語出典編集APIリクエスト型
export interface EditWordSourceAPIRequestDto {
  wordId: number
  oldSourceId: number
  newSourceId: number
}

// 英単語サブ出典削除APIリクエスト型
export interface DeleteWordSourceAPIRequestDto {
  word_id: number
  source_id: number
}

// 英単語サブ出典追加更新APIリクエスト型
export interface UpsertWordSubSourceAPIRequestDto {
  id: number
  wordId: number
  subSource: string
}

// 英単語サブ出典削除APIリクエスト型
export interface DeleteWordSubSourceAPIRequestDto {
  id: number
}

// 英単語意味削除APIリクエスト型
export interface DeleteMeanAPIRequestDto {
  meanId: number
}

// 英単語意味編集APIリクエスト型
export interface EditWordMeanAPIRequestDto {
  wordId: number
  wordMeanId: number
  meanId: number
  partofspeechId: number
  meaning: string
}

// 英単語追加画面で入力した単語、意味のデータを　英単語追加APIに送るためのデータ型
export interface SendToAddWordApiData {
  partOfSpeechId: number
  meaning: string
  partOfSpeechName?: string
}
