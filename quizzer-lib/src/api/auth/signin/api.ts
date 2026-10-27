import type { SignInResult } from '../../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'
import type { ApiResult } from '../..'
import { baseURL } from '../..'
import { setAccessToken } from '../token'
import type { AuthSigninRequestDto } from './dto'

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
        return {
          isSuccess: false,
          result,
          message: errorMessage(MESSAGES.ERROR.MSG00016)
        }
      }
      if (result.status === 'SUCCESS') {
        setAccessToken(result.accessToken)
      }
      return {
        isSuccess: true,
        result,
        message: successMessage(MESSAGES.SUCCESS.MSG00020)
      }
    })
    .catch((error) => {
      return {
        isSuccess: false,
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
