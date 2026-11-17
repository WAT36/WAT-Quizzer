import type { z } from 'zod'
import { errorMessage } from '../..'
import type { ApiResult } from './dto'

type Issue = z.core.$ZodIssue

// スキーマのエラーを画面に表示するメッセージにする（標準ではスキーマのメッセージに「エラー:」を付ける）
export const toErrorMessage = (issue: Issue): string => `エラー:${issue.message}`

// 送信前にリクエストをAPIと同じスキーマで検証する
// 不正なら最初のエラーをtoMessageでメッセージにしたApiResultを返し、問題なければundefinedを返す
// （送るのは元のデータのまま。スキーマで変換した値は使わない）
export const validateRequest = (
  schema: z.ZodType,
  data: unknown,
  toMessage: (issue: Issue) => string = toErrorMessage
): ApiResult | undefined => {
  const result = schema.safeParse(data)
  if (result.success) return undefined
  return {
    isSuccess: false,
    message: errorMessage(toMessage(result.error.issues[0]))
  }
}
