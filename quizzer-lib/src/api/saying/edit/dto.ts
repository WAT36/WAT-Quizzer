import type { z } from 'zod'
import type { editSayingAPIRequestSchema } from './schema'

export type EditSayingAPIRequestDto = z.infer<typeof editSayingAPIRequestSchema>
