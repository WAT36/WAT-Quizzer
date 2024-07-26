import { LinkWordEtymologyAPIRequestDto } from '.'
import { ErrorResponse, ProcessingApiReponse, post } from '../../../../api'

interface LinkWordEtymologyAPIProps {
  linkWordEtymologyData: LinkWordEtymologyAPIRequestDto
}

export const linkWordEtymologyAPI = async ({
  linkWordEtymologyData
}: LinkWordEtymologyAPIProps) => {
  if (
    !linkWordEtymologyData.etymologyName ||
    linkWordEtymologyData.etymologyName === ''
  ) {
    return {
      message: {
        message: 'エラー:語源名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }
  if (linkWordEtymologyData.wordId === -1) {
    return {
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
  ).catch((err) => {
    return {
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
