import type { ToggleCheckAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess, validateRequest } from '../../../..'
import { toggleCheckAPIRequestSchema } from './schema'

interface ToggleCheckAPIButtonProps {
  toggleCheckData: ToggleCheckAPIRequestDto
}

export const toggleWordCheckAPI = async ({
  toggleCheckData
}: ToggleCheckAPIButtonProps): Promise<ApiResult> => {
  const invalid = validateRequest(toggleCheckAPIRequestSchema, toggleCheckData)
  if (invalid) return invalid

  const result = await post(
    '/english/word/check/toggle',
    toggleCheckData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!編集に成功しました',
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
