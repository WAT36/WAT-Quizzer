import type { z } from 'zod'
import type { toggleCheckAPIRequestSchema } from './schema'

// 単語チェック反転APIリクエスト型
export type ToggleCheckAPIRequestDto = z.infer<typeof toggleCheckAPIRequestSchema>
