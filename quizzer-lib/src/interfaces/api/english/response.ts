import { ApiResponse } from '../response'

// 品詞マスタ全取得APIレスポンス型
export interface GetPartsofSpeechAPIResponseDto extends ApiResponse {
  id: number
  name: string
}

// 出典マスタ全取得APIレスポンス型
export interface GetSourceAPIResponseDto extends ApiResponse {
  id: number
  name: string
}

/// TODO フロント側のbuttonAPIでの返り値型だが、、バック側と揃えた方が良い
// データ追加APIの返り値の型
export interface AddDataApiResponse extends ApiResponse {
  insertId: number
}

// 英単語テスト画面での四択選択肢をAPIから受け取るときのデータ型
export interface EnglishBotTestFourChoiceResponse extends ApiResponse {
  correct: {
    mean: string
  }
  dummy: {
    mean: string
  }[]
}
