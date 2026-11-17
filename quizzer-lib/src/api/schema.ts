import { z } from 'zod'

// APIのリクエストで共通に使うスキーマ

// DBのID・番号（正の整数）
export const idSchema = z.number().int().positive()

// 画面のプルダウンなどで選ぶID。未選択(-1)・未設定なら指定したメッセージにする
export const selectedIdSchema = (message: string) =>
  z.number({ error: message }).int(message).positive(message)

// カンマ区切りのカテゴリ名
// 各カテゴリ名の前後の空白(全角を含む)を除き、空のものと重複を除いたカンマ区切りの文字列にする
// （例: " JavaScript, ,非同期処理,JavaScript," → "JavaScript,非同期処理"。カテゴリがなければ空文字）
export const categoryListStringSchema = z
  .string()
  .transform((value) =>
    Array.from(
      new Set(
        value
          .split(',')
          .map((name) => name.trim())
          .filter((name) => name !== '')
      )
    ).join(',')
  )

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

// ---- クエリパラメータ用（値はすべて文字列で届く） ----

// クエリで「未指定」を表す値（画面は未選択を-1、空欄を空文字で送ってくる）
const toUndefinedIfUnspecified = (value: unknown): unknown =>
  value === '' || value === '-1' ? undefined : value

// クエリのID・番号。未指定ならundefined、正の整数として読めなければ400
export const queryIdSchema = z.preprocess(
  toUndefinedIfUnspecified,
  z.coerce.number().int().positive().optional()
)

// クエリの必須のID・番号（未指定・-1・正の整数でない値は400）
export const requiredQueryIdSchema = z.coerce.number().int().positive()

// パスパラメータのID（/xxx/:id）。正の整数でなければ400
export const idParamSchema = z.object({ id: requiredQueryIdSchema })

// クエリの文字列。未指定（空文字・-1）ならundefined
export const queryStringSchema = z.preprocess(
  toUndefinedIfUnspecified,
  z.string().optional()
)

// クエリの率(%)。0〜100の数値、未指定ならundefined
export const queryRateSchema = z.preprocess(
  toUndefinedIfUnspecified,
  z.coerce.number().min(0).max(100).optional()
)

// クエリの真偽値。'true'・'false'のみ受け付け、未指定ならundefined
export const queryBooleanSchema = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'))

// クエリの日付（YYYY-MM-DD）。空ならundefined
export const queryDateSchema = z.preprocess(
  toUndefinedIfUnspecified,
  dateStringSchema.optional()
)

// クエリの問題形式ID（カンマ区切り）を数値の配列にする
// 空・未指定ならundefined（形式で絞り込まない）、数値でないIDがあれば400
export const queryFormatIdsSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    const ids = (value ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '')
    const invalidId = ids.find((id) => !/^\d+$/.test(id))
    if (invalidId !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message: `問題形式IDが不正です(${invalidId})`
      })
      return z.NEVER
    }
    return ids.length > 0 ? Array.from(new Set(ids.map(Number))) : undefined
  })
