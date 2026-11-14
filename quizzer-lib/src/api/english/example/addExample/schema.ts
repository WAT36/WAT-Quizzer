import { z } from 'zod'
import { PULLDOWN_OTHER, sourceSelectSchema } from '../../../schema'

// 例文追加APIのリクエスト
export const addExampleAPIRequestSchema = z
  .object({
    exampleEn: z.string().min(1, '例文(英文)を入力してください'),
    exampleJa: z.string().min(1, '例文(和文)を入力してください'),
    explanation: z.string().optional(),
    wordName: z.string().optional(), // 紐付ける単語（空なら紐付けない）
    sourceId: sourceSelectSchema.optional(),
    newSourceName: z.string().optional() // 出典がその他の場合必要
  })
  .refine((x) => x.sourceId !== PULLDOWN_OTHER || !!x.newSourceName, {
    message: '新規追加する出典を入力してください',
    path: ['newSourceName']
  })
