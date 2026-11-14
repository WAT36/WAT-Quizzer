import { z } from 'zod'

// サインインAPIのリクエスト
// パスワードの強度・長さはCognitoのパスワードポリシーで判定するので、ここでは空でないことだけ確認する
export const authSigninRequestSchema = z.object({
  username: z.string().min(1, 'ユーザー名を入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
  // 新パスワード設定時のみ。サインインでNEW_PASSWORD_REQUIREDが返った時のsession
  session: z.string().optional()
})

// 新パスワード設定APIのリクエスト（サインイン時に返されたsessionが必須）
export const authNewPasswordRequestSchema = authSigninRequestSchema.extend({
  session: z.string().min(1)
})
