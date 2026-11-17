import { z } from 'zod'
import { categoryListStringSchema, idSchema } from '../../schema'
import { MESSAGES } from '../../../constant/messages'

// 四択問題の形式ID
const FOUR_CHOICE_FORMAT_ID = 3
// 四択問題で必要なダミー選択肢の数
const MIN_DUMMY_CHOICE_COUNT = 3

// 問題追加・編集APIで共通の項目
// 画面の入力途中の状態もこの型で持つため、問題文・答えなどは任意項目にしている
// （空かどうか・前後の空白を除いた後に空かどうかはバックエンドのサービスで確認する）
export const quizContentSchema = z.object({
  file_num: idSchema,
  format_id: idSchema.optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
  category: categoryListStringSchema.optional(), // カンマ区切り（各カテゴリ名の前後の空白と空のものは除く）
  img_file: z.string().optional(),
  matched_basic_quiz_id: z.string().optional(), // カンマ区切りの問題番号
  // 四択問題(format_id=3)の場合のみ
  dummyChoice: z
    .array(
      z.object({
        sentense: z.string(),
        isCorrect: z.boolean()
      })
    )
    .optional(),
  explanation: z.string().optional() // 解説
})

// 問題追加APIのリクエスト
// 四択問題はダミー選択肢を3つ以上送る（画面では最初から3つの入力欄がある）
export const addQuizAPIRequestSchema = quizContentSchema.refine(
  (x) =>
    x.format_id !== FOUR_CHOICE_FORMAT_ID ||
    (x.dummyChoice ?? []).length >= MIN_DUMMY_CHOICE_COUNT,
  { message: MESSAGES.ERROR.MSG00018, path: ['dummyChoice'] }
)
