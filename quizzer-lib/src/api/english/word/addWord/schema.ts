import { z } from 'zod'
import { idSchema, PULLDOWN_OTHER, sourceSelectSchema } from '../../../schema'

// 英単語追加APIのリクエスト
export const addWordAPIRequestSchema = z.object({
  inputWord: z
    .object({
      wordName: z.string().min(1, '単語を入力してください'),
      sourceId: sourceSelectSchema,
      newSourceName: z.string().optional(), // 出典がその他の場合必要
      subSourceName: z.string()
    })
    .refine((x) => x.sourceId !== PULLDOWN_OTHER || !!x.newSourceName, {
      message: '新規追加する出典を入力してください',
      path: ['newSourceName']
    }),
  pronounce: z.string(),
  meanArrayData: z.array(
    z
      .object({
        partOfSpeechId: z.union([idSchema, z.literal(PULLDOWN_OTHER)]),
        meaning: z.string().min(1, '意味を入力してください'),
        partOfSpeechName: z.string().optional() // 品詞がその他の場合必要
      })
      .refine(
        (x) => x.partOfSpeechId !== PULLDOWN_OTHER || !!x.partOfSpeechName,
        {
          message: '新規追加する品詞を入力してください',
          path: ['partOfSpeechName']
        }
      )
  )
})
