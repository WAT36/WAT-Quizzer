import { del, ApiResult, ProcessingApiReponse } from '../../../../api'
import { DeleteMeanAPIRequestDto } from '.'

interface DeleteEnglishMeanAPIButtonProps {
  deleteMeanData: DeleteMeanAPIRequestDto
}

export const deleteEnglishMeanAPI = async ({
  deleteMeanData
}: DeleteEnglishMeanAPIButtonProps): Promise<ApiResult> => {
  return await del(
    '/english/word/mean',
    deleteMeanData,
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
}
