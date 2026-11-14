import { z } from 'zod'
import { idOrNewSchema, idSchema } from '../../../../schema'

// 英単語意味編集APIのリクエスト
export const editWordMeanAPIRequestSchema = z.object({
  wordId: idSchema,
  // 単語内での意味の番号。意味がまだない単語に追加する場合は0で送られてくる
  wordMeanId: z.number().int().nonnegative(),
  meanId: idOrNewSchema, // meanのid（-1は新規追加）
  partofspeechId: idSchema,
  meaning: z.string()
})
