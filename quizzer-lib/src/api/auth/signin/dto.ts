export interface AuthSigninRequestDto {
  username: string
  password: string
  // 新パスワード設定時のみ。サインインでNEW_PASSWORD_REQUIREDが返った時のsession
  session?: string
}

// 返り値の型を定義
// refreshTokenはHttpOnly Cookieで返すためbodyには含めない
export type SignInSuccessResult = {
  status: 'SUCCESS'
  accessToken: string
}

export type SignInNewPasswordRequiredResult = {
  status: 'NEW_PASSWORD_REQUIRED'
  session: string
  username: string
}

export type SignInResult = SignInSuccessResult | SignInNewPasswordRequiredResult
