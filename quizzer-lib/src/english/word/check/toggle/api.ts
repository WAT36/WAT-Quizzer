import { ToggleCheckAPIRequestDto } from '.'
import { ProcessingApiReponse, post } from '../../../../api'

interface ToggleCheckAPIButtonProps {
  toggleCheckData: ToggleCheckAPIRequestDto
}

export const toggleWordCheckAPI = async ({
  toggleCheckData
}: ToggleCheckAPIButtonProps) => {
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
