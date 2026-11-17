import { z } from 'zod'
import { PULLDOWN_OTHER, sourceSelectSchema } from '../../../schema'

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
        // 品詞のID、またはその他(-2)。未選択(-1)は不可
        partOfSpeechId: z
          .number({ error: '品詞を入力してください' })
          .int('品詞を入力してください')
          .refine(
            (x) => x > 0 || x === PULLDOWN_OTHER,
            '品詞を入力してください'
          ),
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
