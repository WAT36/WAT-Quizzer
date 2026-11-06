import type { ApiResult } from '../../../..'
import { del, onSuccess } from '../../../..'
import type { DeleteMeanAPIRequestDto } from '.'

interface DeleteEnglishMeanAPIButtonProps {
  deleteMeanData: DeleteMeanAPIRequestDto
}

export const deleteEnglishMeanAPI = async ({
  deleteMeanData
}: DeleteEnglishMeanAPIButtonProps): Promise<ApiResult> => {
  return await del(
    '/english/word/mean',
    deleteMeanData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!削除に成功しました',
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
}
