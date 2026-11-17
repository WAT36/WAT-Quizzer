import { z } from 'zod'

// 問題ファイル追加APIのリクエスト（DBの列はどちらもVARCHAR(256)）
export const addQuizFileApiRequestSchema = z.object({
  file_name: z.string().min(1).max(256), // 内部用のファイル名（画面ではランダムな文字列を付ける）
  file_nickname: z
    .string()
    .trim()
    .min(1, 'ファイル名を入力してください')
    .max(256, 'ファイル名は256文字以内で入力してください') // 画面に表示するファイル名
})
