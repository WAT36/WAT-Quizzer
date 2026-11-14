import { z } from 'zod'
import { idSchema } from '../../../schema'

// 出典・品詞のプルダウンの特別な値
const NONE = -1 // 選択なし
const OTHER = -2 // その他（名前を入力して新規追加する）

// 英単語追加APIのリクエスト
export const addWordAPIRequestSchema = z.object({
  inputWord: z
    .object({
      wordName: z.string().min(1, '単語を入力してください'),
      sourceId: z.union([idSchema, z.literal(NONE), z.literal(OTHER)]),
      newSourceName: z.string().optional(), // 出典がその他の場合必要
      subSourceName: z.string()
    })
    .refine((x) => x.sourceId !== OTHER || !!x.newSourceName, {
      message: '新規追加する出典を入力してください',
      path: ['newSourceName']
    }),
  pronounce: z.string(),
  meanArrayData: z.array(
    z
      .object({
        partOfSpeechId: z.union([idSchema, z.literal(OTHER)]),
        meaning: z.string().min(1, '意味を入力してください'),
        partOfSpeechName: z.string().optional() // 品詞がその他の場合必要
      })
      .refine((x) => x.partOfSpeechId !== OTHER || !!x.partOfSpeechName, {
        message: '新規追加する品詞を入力してください',
        path: ['partOfSpeechName']
      })
  )
})
