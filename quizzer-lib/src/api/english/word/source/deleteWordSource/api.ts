import type { DeleteWordSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { del, onSuccess } from '../../../..'

interface DeleteEnglishWordSourceAPIRequestProps {
  deleteWordSourceData: DeleteWordSourceAPIRequestDto
}

export const deleteEnglishWordSourceAPI = async ({
  deleteWordSourceData
}: DeleteEnglishWordSourceAPIRequestProps): Promise<ApiResult> => {
  const result = await del(
    '/english/word/source',
    deleteWordSourceData,
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
  return result
}
