import type { LinkWordEtymologyAPIRequestDto } from '.'
import type { ErrorResponse, ApiResult, ProcessingApiReponse } from '../../../..'
import { post } from '../../../..'

interface LinkWordEtymologyAPIProps {
  linkWordEtymologyData: LinkWordEtymologyAPIRequestDto
}

export const linkWordEtymologyAPI = async ({
  linkWordEtymologyData
}: LinkWordEtymologyAPIProps): Promise<ApiResult> => {
  if (
    !linkWordEtymologyData.etymologyName ||
    linkWordEtymologyData.etymologyName === ''
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
  if (linkWordEtymologyData.wordId === -1) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:追加する単語IDを入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/english/word/etymology/link',
    linkWordEtymologyData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!追加に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          }
        }
      } else {
        const errorData = data.body as ErrorResponse
        return {
          message: {
            message:
              errorData.message || 'エラー:外部APIとの連携に失敗しました',
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
