import type { z } from 'zod'

// sessionStorageにキャッシュしたAPIの結果を、スキーマで検証して読む
// 保存されていない・JSONでない・形が違う場合はundefinedを返す（呼び出し側でAPIから取り直す）
// 形が違うものは次に正しい値を保存するまで残らないよう削除する
export const readSessionCache = <T extends z.ZodType>(
  key: string,
  schema: T
): z.output<T> | undefined => {
  let saved: string | null
  try {
    saved = sessionStorage.getItem(key)
  } catch {
    return undefined
  }
  if (!saved) return undefined
  let json: unknown
  try {
    json = JSON.parse(saved)
  } catch {
    json = undefined
  }
  const result = schema.safeParse(json)
  if (result.success) return result.data
  sessionStorage.removeItem(key)
  return undefined
}
