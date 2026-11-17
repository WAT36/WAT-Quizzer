import { z } from 'zod'
import {
  idSchema,
  queryDateSchema,
  queryFormatIdsSchema
} from '../../schema'

// カテゴリ別正答率取得APIのクエリ
export const getCategoryRateAPIRequestQuerySchema = z
  .object({
    file_num: z.coerce.number().pipe(idSchema),
    // 日付はDate型にして渡す（期間を指定しない場合はundefined）
    startDate: queryDateSchema.transform((x) => x && new Date(x)),
    endDate: queryDateSchema.transform((x) => x && new Date(x)),
    format_id: queryFormatIdsSchema
  })
  .refine((x) => !x.startDate || !x.endDate || x.startDate <= x.endDate, {
    message: '開始日は終了日以前の日付にしてください',
    path: ['startDate']
  })

// API側でクエリを検証・変換した後のDTO
export type GetCategoryRateAPIRequestParsedDto = z.output<
  typeof getCategoryRateAPIRequestQuerySchema
>
