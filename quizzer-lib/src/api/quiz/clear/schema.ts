import { z } from 'zod'
import { idSchema } from '../../schema'

// 正解登録APIのリクエスト
export const clearQuizAPIRequestSchema = z.object({
  quiz_id: idSchema // 問題のID(quiz.id)
})
