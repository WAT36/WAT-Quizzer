import { z } from 'zod'

// 派生語追加APIのリクエスト
export const addDerivativeAPIRequestSchema = z.object({
  wordName: z.string().min(1, '元単語を入力してください'),
  derivativeName: z.string().min(1, '派生語を入力してください')
})
