import type { DeleteWordSubSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { del, onSuccess, validateRequest } from '../../../..'
import { deleteWordSubSourceAPIRequestSchema } from './schema'

interface DeleteWordSubSourceAPIProps {
  deleteWordSubSourceData: DeleteWordSubSourceAPIRequestDto
}

export const deleteEnglishWordSubSourceAPI = async ({
  deleteWordSubSourceData
}: DeleteWordSubSourceAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(deleteWordSubSourceAPIRequestSchema, deleteWordSubSourceData)
  if (invalid) return invalid

  const result = await del(
    '/english/word/subsource',
    deleteWordSubSourceData,
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
