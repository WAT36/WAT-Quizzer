import type {
  ApiResult,
  ApiResultBody,
  ErrorResponse,
  ProcessingApiReponse
} from './'
import type { Message } from '../..'
import { errorMessage, MESSAGES } from '../..'
import { authFetch } from './auth/token'

export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

type ResponseProcessor = (data: ProcessingApiReponse) => ApiResultBody

// 認証が必要なAPIはauthFetch（トークン付与・期限切れ時の再取得/再ログイン）を通す
const request = (url: string, init: RequestInit, needAuth?: boolean) =>
  needAuth !== false ? authFetch(url, init) : fetch(url, init)

// リクエストを送り、レスポンスをApiResultに変換する。全メソッド共通の処理
const send = async (
  path: string,
  init: RequestInit,
  func: ResponseProcessor,
  needAuth?: boolean
): Promise<ApiResult> => {
  return await request(baseURL + path, init, needAuth)
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then((data) => ({
      isSuccess: data.status >= 200 && data.status < 300,
      ...func(data)
    }))
    .catch((error) => {
      return {
        isSuccess: false,
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

// バックエンドのエラー理由をそのまま画面に出してよいステータス
// 401は再ログインで処理し、5xxの内部エラー文は利用者に見せない
const DISPLAYABLE_ERROR_STATUSES = [400, 404, 409]

const toErrorMessage = ({ status, body }: ProcessingApiReponse): Message => {
  const reason = (body as Partial<ErrorResponse> | null)?.message
  return DISPLAYABLE_ERROR_STATUSES.includes(status) &&
    typeof reason === 'string' &&
    reason
    ? errorMessage(reason)
    : errorMessage(MESSAGES.ERROR.MSG00004)
}

// 成功(200,201)の時だけfuncで変換し、それ以外はエラーメッセージを返す
export const onSuccess =
  (func: ResponseProcessor): ResponseProcessor =>
  (data) =>
    data.status === 200 || data.status === 201
      ? func(data)
      : { message: toErrorMessage(data) }

const jsonRequest = (method: string, jsondata: object): RequestInit => ({
  method,
  body: JSON.stringify(jsondata),
  headers: {
    'Content-Type': 'application/json'
  }
})

export const get = async (
  path: string,
  func: ResponseProcessor,
  queryParam?: { [key: string]: string | number | boolean },
  needAuth?: boolean
): Promise<ApiResult> => {
  const query = queryParam
    ? `?${new URLSearchParams(
        Object.keys(queryParam).reduce(
          (after, key) =>
            queryParam[key] === undefined
              ? after
              : {
                  ...after,
                  [key]: String(queryParam[key])
                },
          {}
        )
      )}`
    : ''

  return await send(path + query, { method: 'GET' }, func, needAuth)
}

export const post = async (
  path: string,
  jsondata: object,
  func: ResponseProcessor
): Promise<ApiResult> => await send(path, jsonRequest('POST', jsondata), func)

export const put = async (
  path: string,
  jsondata: object,
  func: ResponseProcessor
): Promise<ApiResult> => await send(path, jsonRequest('PUT', jsondata), func)

export const del = async (
  path: string,
  jsondata: object,
  func: ResponseProcessor
): Promise<ApiResult> => await send(path, jsonRequest('DELETE', jsondata), func)

export const patch = async (
  path: string,
  jsondata: object,
  func: ResponseProcessor
): Promise<ApiResult> => await send(path, jsonRequest('PATCH', jsondata), func)

// ファイルを送りたい時
export const fileUploadAPI = async (
  path: string,
  file: File,
  func: ResponseProcessor
): Promise<ApiResult> => {
  const formData = new FormData()
  formData.append('file', file)
  return await send(path, { method: 'POST', body: formData }, func)
}
