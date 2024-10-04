import { ApiResponse } from '../../../api'

// partofspeechからの取得結果
export interface PartofSpeechApiResponse extends ApiResponse {
  id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at: string | undefined
}
