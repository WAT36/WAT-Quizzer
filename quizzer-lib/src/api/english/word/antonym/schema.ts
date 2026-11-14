import { z } from 'zod'
import { idSchema } from '../../../schema'

// 対義語追加APIのリクエスト
export const addAntonymAPIRequestSchema = z.object({
  wordId: idSchema,
  antonymWordName: z.string().min(1, '対義語を入力してください')
})
