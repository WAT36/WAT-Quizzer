import { ApiResponse } from '../response'

// 格言取得APIレスポンス型
export interface GetSayingAPIResponseDto extends ApiResponse {
  id?: number
  saying: string
  explanation: string
  name?: string
}

// 啓発本取得APIレスポンス型
export interface GetBookAPIResponseDto extends ApiResponse {
  id: number
  name: string
}
