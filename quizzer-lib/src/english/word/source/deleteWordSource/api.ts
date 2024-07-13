import { DeleteWordSourceAPIRequestDto } from '.'
import { ProcessingApiReponse, del } from '../../../../api'

interface DeleteEnglishWordSourceAPIRequestProps {
  deleteWordSourceData: DeleteWordSourceAPIRequestDto
}

export const deleteEnglishWordSourceAPI = async ({
  deleteWordSourceData
}: DeleteEnglishWordSourceAPIRequestProps) => {
  const result = await del(
    '/english/word/source',
    deleteWordSourceData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!削除に成功しました',
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
