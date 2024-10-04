import { ApiResponse } from '@/api'

export interface GetSayingRequest {
  id?: number
}

export interface GetSayingResponse extends ApiResponse {
  id: number
  saying: string
  explanation?: string
  selfhelp_book?: {
    name: string
  }
}
