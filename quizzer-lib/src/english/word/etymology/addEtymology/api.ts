import { AddEtymologyAPIRequestDto } from '.'
import { ErrorResponse, ProcessingApiReponse, post } from '../../../../api'

interface AddEtymologyAPIProps {
  addEtymologyData: AddEtymologyAPIRequestDto
}

export const addEtymologyAPI = async ({
  addEtymologyData
}: AddEtymologyAPIProps) => {
  if (
    !addEtymologyData.etymologyName ||
    addEtymologyData.etymologyName === ''
  ) {
    return {
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
