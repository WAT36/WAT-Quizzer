import type { z } from 'zod'
import type { addEtymologyAPIRequestSchema } from './schema'

// 語源追加APIリクエスト型
export type AddEtymologyAPIRequestDto = z.infer<typeof addEtymologyAPIRequestSchema>
