import { z } from 'zod'

// 語源追加APIのリクエスト
export const addEtymologyAPIRequestSchema = z.object({
  etymologyName: z.string().min(1, '語源名を入力してください')
})
