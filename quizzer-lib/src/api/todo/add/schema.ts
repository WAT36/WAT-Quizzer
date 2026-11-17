import { z } from 'zod'

// Todo追加APIのリクエスト
export const addTodoAPIRequestSchema = z.object({
  todo: z.string().trim().min(1, 'Todoを入力してください') // Todo名
})
