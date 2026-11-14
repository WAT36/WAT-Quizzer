import type { z } from 'zod'
import type { linkWordEtymologyAPIRequestSchema } from './schema'

// 単語-語源紐付けAPIリクエスト型
export type LinkWordEtymologyAPIRequestDto = z.infer<typeof linkWordEtymologyAPIRequestSchema>
