// APIから受け取ったデータを変換しフロント側で処理する型
import type { Message } from '../..'
import type { Response } from 'express'

export interface ProcessingApiReponse {
  status: number
  body: ApiResponse | ApiResponse[] | Response
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
  result?: ApiResponse | ApiResponse[] | Response
  total?: number
}
