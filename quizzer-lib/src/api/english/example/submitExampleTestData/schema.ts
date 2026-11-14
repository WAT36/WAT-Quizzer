import { z } from 'zod'
import { idSchema } from '../../../schema'
import { EXAMPLE_TEST_TYPE } from '../../../../constant/englishbot/exampleTestType'

const testTypes: number[] = Object.values(EXAMPLE_TEST_TYPE)

// 例文テスト結果送信APIのリクエスト
export const submitExampleTestDataAPIRequestSchema = z.object({
  exampleId: idSchema,
  testType: z
    .number()
    .int()
    .refine((x) => testTypes.includes(x), 'テストの種類が不正です')
})
