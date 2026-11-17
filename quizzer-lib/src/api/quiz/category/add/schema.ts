import { z } from 'zod'
import { idSchema } from '../../../schema'

// 問題にカテゴリを追加するAPIのリクエスト
export const addCategoryToQuizAPIRequestSchema = z.object({
  quiz_ids: z.array(idSchema).min(1), // 問題のID(quiz.id)
  category: z.string().min(1, 'カテゴリを入力してください') // カンマ区切り
})
