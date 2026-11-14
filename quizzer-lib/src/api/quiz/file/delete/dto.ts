import type { z } from 'zod'
import type { deleteQuizFileApiRequestSchema } from './schema'

export type DeleteQuizFileApiRequest = z.infer<
  typeof deleteQuizFileApiRequestSchema
>
