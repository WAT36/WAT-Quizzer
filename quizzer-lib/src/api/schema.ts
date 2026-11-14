import { z } from 'zod'

// APIのリクエストで共通に使うスキーマ

// DBのID・番号（正の整数）
export const idSchema = z.number().int().positive()
