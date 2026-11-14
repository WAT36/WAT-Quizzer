import { z } from 'zod'

// 出典への単語一括登録APIのリクエスト（バッチ用）
export const registerWordsToSourceSchema = z.object({
  // バッチは入力ファイルの1行目をそのまま文字列で送ってくるので、数値に変換して受け取る
  sourceId: z.coerce.number().int().positive(),
  words: z.array(z.string()) // 登録する単語名
})
