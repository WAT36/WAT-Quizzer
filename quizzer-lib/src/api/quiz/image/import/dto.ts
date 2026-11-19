import type { z } from 'zod'
import type { ApiResponse } from '../../..'
import type { importImageOfQuizAPIRequestSchema } from './schema'

export type ImportImageOfQuizAPIRequestDto = z.infer<
  typeof importImageOfQuizAPIRequestSchema
>

// 保存して問題に紐付けた画像のファイル名
export interface ImportImageOfQuizAPIResponseDto extends ApiResponse {
  fileName: string
}
