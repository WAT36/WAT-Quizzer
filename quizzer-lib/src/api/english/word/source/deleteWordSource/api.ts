import type { DeleteWordSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { del, onSuccess, validateRequest } from '../../../..'
import { deleteWordSourceAPIRequestSchema } from './schema'

interface DeleteEnglishWordSourceAPIRequestProps {
  deleteWordSourceData: DeleteWordSourceAPIRequestDto
}

export const deleteEnglishWordSourceAPI = async ({
  deleteWordSourceData
}: DeleteEnglishWordSourceAPIRequestProps): Promise<ApiResult> => {
  const invalid = validateRequest(deleteWordSourceAPIRequestSchema, deleteWordSourceData)
  if (invalid) return invalid

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
