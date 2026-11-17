import type { z } from 'zod'
import type { addCategoryToQuizAPIRequestSchema } from './schema'

export type AddCategoryToQuizAPIRequestDto = z.infer<
  typeof addCategoryToQuizAPIRequestSchema
>
