import type { z } from 'zod'
import type { deleteQuizAPIRequestSchema } from './schema'

// 問題削除APIリクエスト型（ファイル番号と問題番号で問題を指定する）
export type DeleteQuizAPIRequestDto = z.infer<typeof deleteQuizAPIRequestSchema>
