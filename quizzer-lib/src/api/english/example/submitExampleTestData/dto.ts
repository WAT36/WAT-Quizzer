import type { z } from 'zod'
import type { submitExampleTestDataAPIRequestSchema } from './schema'

// 例文テスト結果送信APIリクエスト型
export type SubmitExampleTestDataAPIRequestDto = z.infer<
  typeof submitExampleTestDataAPIRequestSchema
>
