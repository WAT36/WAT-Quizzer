import type { AddEtymologyAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess } from '../../../..'

interface AddEtymologyAPIProps {
  addEtymologyData: AddEtymologyAPIRequestDto
}

export const addEtymologyAPI = async ({
  addEtymologyData
}: AddEtymologyAPIProps): Promise<ApiResult> => {
  if (
    !addEtymologyData.etymologyName ||
    addEtymologyData.etymologyName === ''
  ) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:語源名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

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
