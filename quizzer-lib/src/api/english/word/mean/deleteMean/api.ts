import type { ApiResult } from '../../../..'
import { del, onSuccess, validateRequest } from '../../../..'
import { deleteMeanAPIRequestSchema } from './schema'
import type { DeleteMeanAPIRequestDto } from '.'

interface DeleteEnglishMeanAPIButtonProps {
  deleteMeanData: DeleteMeanAPIRequestDto
}

export const deleteEnglishMeanAPI = async ({
  deleteMeanData
}: DeleteEnglishMeanAPIButtonProps): Promise<ApiResult> => {
  const invalid = validateRequest(deleteMeanAPIRequestSchema, deleteMeanData)
  if (invalid) return invalid

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
