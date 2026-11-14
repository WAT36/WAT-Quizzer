import { z } from 'zod'
import { dateStringSchema } from '../../schema'

// Todo日記追加APIのリクエスト
export const addTodoDiaryAPIRequestSchema = z.object({
  date: dateStringSchema
})
