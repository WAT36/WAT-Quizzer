import { z } from 'zod'

// 英単語検索APIのクエリ（いずれも部分一致。未指定なら絞り込まない）
export const searchWordAPIRequestSchema = z.object({
  wordName: z.string().optional(),
  meanQuery: z.string().optional(),
  subSourceName: z.string().optional()
})
