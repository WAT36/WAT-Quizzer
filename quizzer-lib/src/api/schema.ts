import { z } from 'zod'

// APIのリクエストで共通に使うスキーマ

// DBのID・番号（正の整数）
export const idSchema = z.number().int().positive()

// 追加・更新を兼ねるAPIで、更新対象のID。-1は新規追加
export const idOrNewSchema = z.union([idSchema, z.literal(-1)])

// 出典・品詞などのプルダウンの特別な値
export const PULLDOWN_NONE = -1 // 選択なし
export const PULLDOWN_OTHER = -2 // その他（名前を入力して新規追加する）

// 出典のプルダウンで選んだ値（ID・選択なし・その他）
export const sourceSelectSchema = z.union([
  idSchema,
  z.literal(PULLDOWN_NONE),
  z.literal(PULLDOWN_OTHER)
])

// 年月日が実在する日付か（2024-13-01や2024-02-30を弾く）
const isExistingDate = (value: string): boolean => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

// 日付（YYYY-MM-DD形式の実在する日付）
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付はYYYY-MM-DD形式で入力してください',
    abort: true
  })
  .refine(isExistingDate, '有効な日付を入力してください')
