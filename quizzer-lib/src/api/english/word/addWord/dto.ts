import type { z } from 'zod'
import type { addWordAPIRequestSchema } from './schema'

// 英単語追加APIリクエスト型
export type AddWordAPIRequestDto = z.infer<typeof addWordAPIRequestSchema>
