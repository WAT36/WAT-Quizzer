import type { z } from 'zod'
import type { addSayingAPIRequestSchema } from './schema'

// 格言追加リクエスト型
export type AddSayingAPIRequestDto = z.infer<typeof addSayingAPIRequestSchema>
