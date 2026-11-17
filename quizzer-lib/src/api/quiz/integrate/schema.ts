import { z } from 'zod'
import { idSchema } from '../../schema'

// 問題統合APIのリクエスト（問題のID(quiz.id)で指定する）
export const integrateToQuizAPIRequestSchema = z.object({
  fromQuizId: idSchema,
  toQuizId: idSchema
})
