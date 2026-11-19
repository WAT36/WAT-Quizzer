import { z } from 'zod'
import { requiredQueryIdSchema } from '../../../schema'

// 検索の追加指示（「地図で」「意味を表す図解」など）の最大文字数
export const QUIZ_IMAGE_SEARCH_HINT_MAX_LENGTH = 100

// 問題の参考画像の候補をWebから探すAPIのクエリ
export const searchImageCandidatesOfQuizAPIRequestSchema = z.object({
  quiz_id: requiredQueryIdSchema, // 問題のID(quiz.id)
  hint: z
    .string()
    .trim()
    .max(
      QUIZ_IMAGE_SEARCH_HINT_MAX_LENGTH,
      `追加指示は${QUIZ_IMAGE_SEARCH_HINT_MAX_LENGTH}文字以内で入力してください`
    )
    .optional()
})
