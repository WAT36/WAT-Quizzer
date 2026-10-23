import type { ApiResponse } from '../../../..'

export interface DeleteAnswerLogOfFileApiRequestDto {
  file_id: number
}

// 回答ログ削除(ファイル指定)APIのレスポンス（削除した件数）
export interface DeleteAnswerLogOfFileApiResponseDto extends ApiResponse {
  count: number
}
