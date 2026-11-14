import type { z } from 'zod'
import type { changeExampleAssociationAPIRequestSchema } from './schema'

// 例文紐付け変更APIリクエスト型
export type ChangeExampleAssociationAPIRequestDto = z.infer<
  typeof changeExampleAssociationAPIRequestSchema
>
