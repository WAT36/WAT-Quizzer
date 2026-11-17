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
  // API処理が成功したか（API.tsの共通処理でHTTPステータスから付与。各APIの変換関数で上書き可）
  isSuccess: boolean
  message: Message
  result?: ApiResponse | ApiResponse[] | Response
  total?: number
}

// 各APIの変換関数(API.tsのfunc)が返す型。isSuccessは共通処理で付与するため省略可（返した場合はそちらを優先）
export type ApiResultBody = Omit<ApiResult, 'isSuccess'> & { isSuccess?: boolean }
