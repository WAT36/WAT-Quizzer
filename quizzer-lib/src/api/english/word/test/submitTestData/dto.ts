import type { z } from 'zod'
import type { submitEnglishWordTestDataAPIRequestSchema } from './schema'

// 英単語テスト結果送信APIリクエスト型
export type SubmitEnglishWordTestDataAPIRequestDto = z.infer<typeof submitEnglishWordTestDataAPIRequestSchema>
