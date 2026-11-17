import { z } from 'zod'

// sessionStorageにキャッシュした単語・熟語の件数のまとめ
export const wordSummaryCacheSchema = z.array(
  z.looseObject({
    name: z.string(),
    count: z.number()
  })
)
