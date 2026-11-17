import type { z } from 'zod'
import type { registerWordsToSourceSchema } from './schema'

export type RegisterWordsToSourceDto = z.infer<
  typeof registerWordsToSourceSchema
>
