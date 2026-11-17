import type { z } from 'zod'
import type { addDerivativeAPIRequestSchema } from './schema'

// 派生語追加APIリクエスト型
export type AddDerivativeAPIRequestDto = z.infer<typeof addDerivativeAPIRequestSchema>
