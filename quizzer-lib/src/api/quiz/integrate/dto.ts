import type { z } from 'zod'
import type { integrateToQuizAPIRequestSchema } from './schema'

export type IntegrateToQuizAPIRequestDto = z.infer<
  typeof integrateToQuizAPIRequestSchema
>
