import { z } from 'zod'
import { idSchema } from '../../../schema'

// 例文紐付け変更APIのリクエスト
export const changeExampleAssociationAPIRequestSchema = z.object({
  wordName: z.string().min(1, '単語を入力してください'),
  exampleIdList: z
    .array(idSchema)
    .min(1, '紐付けを変更する例文が選択されていません'),
  isAssociation: z.boolean() // true: 紐付ける、false: 紐付けを外す
})
