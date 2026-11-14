import type { z } from 'zod'
import type {
  addCategoryParentChildAPIRequestSchema,
  deleteCategoryParentChildAPIRequestSchema
} from './schema'

export interface GetCategoryParentChildListAPIRequestDto {
  file_num: number
}

export interface CategoryParentChildAPIResponseDto {
  id: number
  parent_category_id: number
  parent_category_name: string
  child_category_id: number
  child_category_name: string
}

export type AddCategoryParentChildAPIRequestDto = z.infer<
  typeof addCategoryParentChildAPIRequestSchema
>

export type DeleteCategoryParentChildAPIRequestDto = z.infer<
  typeof deleteCategoryParentChildAPIRequestSchema
>
