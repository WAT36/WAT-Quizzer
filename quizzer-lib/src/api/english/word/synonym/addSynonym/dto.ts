import type { z } from 'zod'
import type { addSynonymAPIRequestSchema } from './schema'

// 類義語追加APIリクエスト型
export type AddSynonymAPIRequestDto = z.infer<typeof addSynonymAPIRequestSchema>
