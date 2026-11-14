import type { z } from 'zod'
import type { addBookAPIRequestSchema } from './schema'

// 啓発本登録APIリクエスト型
export type AddBookAPIRequestDto = z.infer<typeof addBookAPIRequestSchema>
