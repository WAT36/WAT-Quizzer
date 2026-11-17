import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 類義語追加APIのリクエスト
export const addSynonymAPIRequestSchema = z.object({
  wordId: idSchema,
  synonymWordName: z.string().trim().min(1, '類義語を入力してください')
})
