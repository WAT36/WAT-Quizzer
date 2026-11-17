import type { z } from 'zod'
import type { deleteWordSubSourceAPIRequestSchema } from './schema'

// 英単語サブ出典削除APIリクエスト型
export type DeleteWordSubSourceAPIRequestDto = z.infer<typeof deleteWordSubSourceAPIRequestSchema>
