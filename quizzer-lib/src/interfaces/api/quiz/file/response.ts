import { ApiResponse } from '../../response'

// 問題ファイル取得APIのレスポンス（基礎応用込み）
export interface GetQuizFileApiResponseDto extends ApiResponse {
  file_num: number
  file_name: string
  file_nickname: string
}
