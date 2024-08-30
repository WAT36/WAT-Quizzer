import { ApiResponse } from '../../..'

export interface GetRandomSayingResponse extends ApiResponse {
  saying: string
  explanation: string
  selfhelp_book: {
    name: string
  }
}
