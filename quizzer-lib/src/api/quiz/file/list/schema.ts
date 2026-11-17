import { z } from 'zod'

// sessionStorageにキャッシュした問題ファイル一覧（画面で使う項目だけ確認し、他の項目はそのまま残す）
export const quizFileListCacheSchema = z.array(
  z.looseObject({
    file_num: z.number(),
    file_name: z.string(),
    file_nickname: z.string()
  })
)
