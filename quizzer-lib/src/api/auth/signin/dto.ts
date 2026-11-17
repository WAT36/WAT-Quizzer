import type { z } from 'zod'
import type {
  authNewPasswordRequestSchema,
  authSigninRequestSchema
} from './schema'

export type AuthSigninRequestDto = z.infer<typeof authSigninRequestSchema>

export type AuthNewPasswordRequestDto = z.infer<
  typeof authNewPasswordRequestSchema
>

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
