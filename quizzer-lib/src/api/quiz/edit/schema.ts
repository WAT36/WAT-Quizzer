import { z } from 'zod'
import { idSchema } from '../../schema'
import { quizContentSchema } from '../add/schema'

// 問題編集APIのリクエスト（問題追加の項目に、編集する問題の指定を加えたもの）
export const editQuizAPIRequestSchema = quizContentSchema.extend({
  quiz_id: idSchema,
  quiz_num: idSchema,
  // 問題取得APIの値をそのまま編集画面に入れるため、画像なし(DBではnull)はnullで送られてくる
  img_file: z.string().nullable().optional()
  // dummyChoice: 四択問題(format_id=3)の場合のみ。登録済みのダミー選択肢と同じ件数(常に3件)・id昇順で送る
})
