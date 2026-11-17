import { z } from 'zod'

// 啓発本登録APIのリクエスト
export const addBookAPIRequestSchema = z.object({
  book_name: z
    .string()
    .trim()
    .min(1, '本の名前を入力してください')
    .max(256, '本の名前は256文字以内で入力してください')
})
