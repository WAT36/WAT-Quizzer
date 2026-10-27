import type { ToggleCheckAPIRequestDto } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../../..'
import { post } from '../../../..'

interface ToggleCheckAPIButtonProps {
  toggleCheckData: ToggleCheckAPIRequestDto
}

export const toggleWordCheckAPI = async ({
  toggleCheckData
}: ToggleCheckAPIButtonProps): Promise<ApiResult> => {
  const result = await post(
    '/english/word/check/toggle',
    toggleCheckData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          }
        }
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    }
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
