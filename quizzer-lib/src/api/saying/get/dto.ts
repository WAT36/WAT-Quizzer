import type { ApiResponse } from '../..'

// ID指定で格言を取得するAPIのリクエスト型
export interface GetSayingByIdRequest {
  id: number
}

export interface GetSayingResponse extends ApiResponse {
  id: number
  saying: string
  explanation?: string
  selfhelp_book?: {
    name: string
  }
}
