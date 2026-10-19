import type { ApiResponse } from '../../..'

// 問題形式リスト取得APIのレスポンス（基礎応用込み）
export interface GetQuizFormatApiResponseDto extends ApiResponse {
  id: number
  name: string
}
