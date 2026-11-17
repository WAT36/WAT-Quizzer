import type { z } from 'zod'
import type { editWordMeanAPIRequestSchema } from './schema'

// 英単語意味編集APIリクエスト型
export type EditWordMeanAPIRequestDto = z.infer<typeof editWordMeanAPIRequestSchema>
