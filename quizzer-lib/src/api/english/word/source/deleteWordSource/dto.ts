import type { z } from 'zod'
import type { deleteWordSourceAPIRequestSchema } from './schema'

// 英単語出典削除APIリクエスト型
export type DeleteWordSourceAPIRequestDto = z.infer<typeof deleteWordSourceAPIRequestSchema>
