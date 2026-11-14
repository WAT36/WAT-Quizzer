import { z } from 'zod'
import { idSchema } from '../../../../schema'
import { WORD_TEST_TYPE } from '../../../../../constant/englishbot/wordTestType'

const testTypes: number[] = Object.values(WORD_TEST_TYPE)

// 英単語テスト結果送信APIのリクエスト
export const submitEnglishWordTestDataAPIRequestSchema = z.object({
  wordId: idSchema,
  testType: z
    .number()
    .int()
    .refine((x) => testTypes.includes(x), 'テストの種類が不正です')
})
