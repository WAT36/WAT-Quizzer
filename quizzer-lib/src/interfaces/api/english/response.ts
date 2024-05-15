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

// partofspeechからの取得結果
export interface PartofSpeechApiResponse extends ApiResponse {
  id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at: string | undefined
}

// word_summarizeからの取得結果
export interface WordSummaryApiResponse extends ApiResponse {
  name: string
  count: number
}

// 英単語（単語IDで）取得APIの返り値
export interface EnglishWordByIdApiResponse extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    mean_source: {
      source: {
        id: number
        name: string
      }
    }[]
    partsofspeech: {
      id: number
      name: string
    }
    id: number
    wordmean_id: number
    meaning: string
  }[]
  word_subsource: {
    id: number
    subsource: string
  }[]
}

// 英単語の出典（単語IDで）取得APIの返り値
export interface EnglishWordSourceByIdApiResponse extends ApiResponse {
  word_id: number
  word_name: string
  source_id: number
  source_name: string
}

// 英単語のサブ出典（単語IDで）取得APIの返り値
export interface EnglishWordSubSourceByIdApiResponse extends ApiResponse {
  subsource: string
}
