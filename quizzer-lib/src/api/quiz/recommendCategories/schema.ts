import { z } from 'zod'
import { requiredQueryIdSchema } from '../../schema'

// おすすめカテゴリ取得APIのクエリ
export const getRecommendedCategoriesAPIRequestSchema = z.object({
  file_num: requiredQueryIdSchema
})
