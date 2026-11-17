import type { z } from 'zod'
import type { clearQuizAPIRequestSchema } from './schema'

export type ClearQuizAPIRequestDto = z.infer<typeof clearQuizAPIRequestSchema>
