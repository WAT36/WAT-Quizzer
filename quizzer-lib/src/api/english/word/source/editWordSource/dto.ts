import type { z } from 'zod'
import type { editWordSourceAPIRequestSchema } from './schema'

// 英単語出典編集APIリクエスト型
export type EditWordSourceAPIRequestDto = z.infer<typeof editWordSourceAPIRequestSchema>
