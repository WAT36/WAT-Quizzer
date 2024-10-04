// APIから受け取ったデータを変換しフロント側で処理する型
import { Message } from '../..'

export interface ProcessingApiReponse {
  status: number
  body: ApiResponse | ApiResponse[]
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}

export interface ErrorResponse extends ApiResponse {
  statusCode: number
  message: string
}

// このquizzer-libのAPIが返すデータ型（Messageを付加する）
export interface ApiResult {
  message: Message
  result?: ApiResponse | ApiResponse[]
}

export interface AddAPIResponseDto {
  result: string
}
