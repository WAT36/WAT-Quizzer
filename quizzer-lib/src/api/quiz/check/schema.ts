import { z } from 'zod'
import { idSchema } from '../../schema'

// 問題にチェックを付ける・外すAPIのリクエスト
export const checkQuizAPIRequestSchema = z.object({
  quiz_ids: z.array(idSchema).min(1) // 問題のID(quiz.id)
})

// 問題のチェック反転APIのリクエスト
export const reverseCheckQuizAPIRequestSchema = z.object({
  quiz_id: idSchema // 問題のID(quiz.id)
})
