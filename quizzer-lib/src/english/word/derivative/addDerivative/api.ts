import { AddDerivativeAPIRequestDto } from '.'
import { ErrorResponse, ProcessingApiReponse, post } from '../../../../api'

interface AddDerivativeAPIProps {
  addDerivativeData: AddDerivativeAPIRequestDto
}

export const addDerivativeAPI = async ({
  addDerivativeData
}: AddDerivativeAPIProps) => {
  if (!addDerivativeData.wordName || addDerivativeData.wordName === '') {
    return {
      message: {
        message: 'エラー:元単語名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }
  if (
    !addDerivativeData.derivativeName ||
    addDerivativeData.derivativeName === ''
  ) {
    return {
      message: {
        message: 'エラー:追加する単語名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/english/word/derivative',
    addDerivativeData,
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
