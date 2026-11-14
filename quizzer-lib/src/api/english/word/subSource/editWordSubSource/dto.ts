import type { z } from 'zod'
import type { editWordSubSourceAPIRequestSchema } from './schema'

// 英単語サブ出典追加更新APIリクエスト型
export type EditWordSubSourceAPIRequestDto = z.infer<typeof editWordSubSourceAPIRequestSchema>
