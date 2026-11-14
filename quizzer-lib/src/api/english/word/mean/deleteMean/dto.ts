import type { z } from 'zod'
import type { deleteMeanAPIRequestSchema } from './schema'

// 英単語意味削除APIリクエスト型
export type DeleteMeanAPIRequestDto = z.infer<typeof deleteMeanAPIRequestSchema>
