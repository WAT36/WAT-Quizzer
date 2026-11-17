import type { z } from 'zod'
import type { addExampleAPIRequestSchema } from './schema'

// 例文追加APIリクエスト型
export type AddExampleAPIRequestDto = z.infer<typeof addExampleAPIRequestSchema>
