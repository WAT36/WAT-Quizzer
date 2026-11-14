import type { z } from 'zod'
import type { addAntonymAPIRequestSchema } from './schema'

// 対義語追加APIリクエスト型
export type AddAntonymAPIRequestDto = z.infer<typeof addAntonymAPIRequestSchema>
