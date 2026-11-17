import { z } from 'zod'

// sessionStorageにキャッシュした問題形式一覧
export const quizFormatListCacheSchema = z.array(
  z.looseObject({
    id: z.number(),
    name: z.string()
  })
)
