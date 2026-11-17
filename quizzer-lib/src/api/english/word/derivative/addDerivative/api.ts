import type { AddDerivativeAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess, validateRequest } from '../../../..'
import { addDerivativeAPIRequestSchema } from './schema'

interface AddDerivativeAPIProps {
  addDerivativeData: AddDerivativeAPIRequestDto
}

export const addDerivativeAPI = async ({
  addDerivativeData
}: AddDerivativeAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(addDerivativeAPIRequestSchema, addDerivativeData)
  if (invalid) return invalid

  const result = await post(
    '/english/word/derivative',
    addDerivativeData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!追加に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  ).catch(() => {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
