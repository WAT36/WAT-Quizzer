import type { AddAntonymAPIRequestDto } from '.'
import type { ApiResult } from '../../..'
import { post, onSuccess } from '../../..'

interface AddAntonymAPIProps {
  addAntonymData: AddAntonymAPIRequestDto
}

export const addAntonymAPI = async ({ addAntonymData }: AddAntonymAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/english/word/antonym',
    addAntonymData,
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
