import { z } from 'zod'
import { categoryListStringSchema, idSchema } from '../../schema'

// 問題追加APIのリクエスト
// 画面の入力途中の状態もこの型で持つため、問題文・答えなどは任意項目にしている
// （空かどうか・前後の空白を除いた後に空かどうかはバックエンドのサービスで確認する）
export const addQuizAPIRequestSchema = z.object({
  file_num: idSchema,
  format_id: idSchema.optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
  category: categoryListStringSchema.optional(), // カンマ区切り（各カテゴリ名の前後の空白と空のものは除く）
  img_file: z.string().optional(),
  matched_basic_quiz_id: z.string().optional(), // カンマ区切りの問題番号
  // 四択問題(format_id=3)の場合のみ
  dummyChoice: z
    .array(
      z.object({
        sentense: z.string(),
        isCorrect: z.boolean()
      })
    )
    .optional(),
  explanation: z.string().optional() // 解説
})
