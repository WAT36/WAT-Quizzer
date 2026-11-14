import { z } from 'zod'
import { idSchema } from '../../schema'

// カテゴリ親子関係追加APIのリクエスト
export const addCategoryParentChildAPIRequestSchema = z
  .object({
    file_num: idSchema,
    parent_category: z.string().min(1, '親カテゴリを選択して下さい'),
    child_category: z.string().min(1, '子カテゴリを選択して下さい')
  })
  .refine((x) => x.parent_category !== x.child_category, {
    message: '親カテゴリと子カテゴリに同じカテゴリは設定できません',
    path: ['child_category']
  })

// カテゴリ親子関係削除APIのリクエスト
export const deleteCategoryParentChildAPIRequestSchema = z.object({
  id: idSchema // category_parent_childのid
})
