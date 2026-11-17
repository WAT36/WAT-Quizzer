import { z } from 'zod'
import { categoryListStringSchema, idSchema } from '../../../schema'

// 問題からカテゴリを削除するAPIのリクエスト
export const deleteCategoryOfQuizAPIRequestSchema = z.object({
  quiz_ids: z.array(idSchema).min(1), // 問題のID(quiz.id)
  category: categoryListStringSchema.pipe(
    z.string().min(1, 'カテゴリを入力してください')
  ) // カンマ区切り
})
