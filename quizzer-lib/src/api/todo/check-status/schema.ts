import { z } from 'zod'
import { dateStringSchema, idSchema } from '../../schema'

// Todoチェック状態保存APIのリクエスト
export const saveTodoCheckStatusAPIRequestSchema = z.object({
  date: dateStringSchema,
  completedTodoIds: z.array(idSchema) // 完了したTodoのID（全部未完了なら空）
})
