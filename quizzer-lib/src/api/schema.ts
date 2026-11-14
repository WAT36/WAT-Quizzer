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
