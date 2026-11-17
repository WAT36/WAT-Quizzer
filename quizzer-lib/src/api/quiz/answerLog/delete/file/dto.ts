import type { z } from 'zod'
import type { ApiResponse } from '../../../..'
import type { deleteAnswerLogOfFileApiRequestSchema } from './schema'

export type DeleteAnswerLogOfFileApiRequestDto = z.infer<
  typeof deleteAnswerLogOfFileApiRequestSchema
>

// 回答ログ削除(ファイル指定)APIのレスポンス（削除した件数）
export interface DeleteAnswerLogOfFileApiResponseDto extends ApiResponse {
  count: number
}
