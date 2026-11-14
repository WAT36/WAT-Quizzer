import type { z } from 'zod'
import type {
  checkQuizAPIRequestSchema,
  reverseCheckQuizAPIRequestSchema
} from './schema'

// 問題にチェックを付ける・外すAPIリクエスト型
export type CheckQuizAPIRequestDto = z.infer<typeof checkQuizAPIRequestSchema>

// 問題のチェック反転APIリクエスト型
export type ReverseCheckQuizAPIRequestDto = z.infer<
  typeof reverseCheckQuizAPIRequestSchema
>
