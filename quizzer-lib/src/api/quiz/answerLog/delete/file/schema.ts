import { z } from 'zod'
import { idSchema } from '../../../../schema'

// 回答ログ削除(ファイル指定)APIのリクエスト
export const deleteAnswerLogOfFileApiRequestSchema = z.object({
  file_id: idSchema // ファイル番号
})
