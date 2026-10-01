import {
  errorMessage,
  MESSAGES,
  SignInResult,
  successMessage
} from '../../../..'
import { ApiResult, baseURL } from '../..'
import { setAccessToken } from '../token'
import { AuthSigninRequestDto } from './dto'

interface AuthSigninAPIProps {
  authSigninRequestData: AuthSigninRequestDto
}

// サインイン系API共通処理
// refreshTokenのCookieを受け取るためcredentials: 'include'で送る。成功時はaccessTokenをメモリに保持する
const signinRequest = async (
  path: string,
  authSigninRequestData: AuthSigninRequestDto
): Promise<ApiResult> => {
  return await fetch(baseURL + path, {
    method: 'POST',
    body: JSON.stringify(authSigninRequestData),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then(async (response) => {
      // TODO 型定義
      const result = (await response.json()) as SignInResult
      if (response.status !== 200) {
        return { result, message: errorMessage(MESSAGES.ERROR.MSG00016) }
      }
      if (result.status === 'SUCCESS') {
        setAccessToken(result.accessToken)
      }
      return {
        result,
        message: successMessage(MESSAGES.SUCCESS.MSG00020)
      }
    })
    .catch((error) => {
      return {
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

export const authSigninAPI = async ({
  authSigninRequestData
}: AuthSigninAPIProps): Promise<ApiResult> => {
  return await signinRequest('/auth/signin', authSigninRequestData)
}

export const authNewPasswordSigninAPI = async ({
  authSigninRequestData
}: AuthSigninAPIProps): Promise<ApiResult> => {
  return await signinRequest('/auth/newpassword', authSigninRequestData)
}
