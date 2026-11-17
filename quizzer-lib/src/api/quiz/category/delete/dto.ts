import type { z } from 'zod'
import type { deleteCategoryOfQuizAPIRequestSchema } from './schema'

// クイズからカテゴリ削除APIリクエスト型
export type DeleteCategoryOfQuizAPIRequestDto = z.infer<
  typeof deleteCategoryOfQuizAPIRequestSchema
>
