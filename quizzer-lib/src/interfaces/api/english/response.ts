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
