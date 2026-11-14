import type { z } from 'zod'
import type { addQuizFileApiRequestSchema } from './schema'

export type AddQuizFileApiRequest = z.infer<typeof addQuizFileApiRequestSchema>
