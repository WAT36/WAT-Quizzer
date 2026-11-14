import { z } from 'zod'

// APIのリクエストで共通に使うスキーマ

// DBのID・番号（正の整数）
export const idSchema = z.number().int().positive()

// 追加・更新を兼ねるAPIで、更新対象のID。-1は新規追加
export const idOrNewSchema = z.union([idSchema, z.literal(-1)])
