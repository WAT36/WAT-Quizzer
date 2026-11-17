import type { AddEtymologyAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess, validateRequest } from '../../../..'
import { addEtymologyAPIRequestSchema } from './schema'

interface AddEtymologyAPIProps {
  addEtymologyData: AddEtymologyAPIRequestDto
}

export const addEtymologyAPI = async ({
  addEtymologyData
}: AddEtymologyAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(addEtymologyAPIRequestSchema, addEtymologyData)
  if (invalid) return invalid

  const result = await post(
    '/english/word/etymology',
    addEtymologyData,
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
