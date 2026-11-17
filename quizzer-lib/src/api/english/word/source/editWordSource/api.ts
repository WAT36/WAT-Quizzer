import type { EditWordSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess, validateRequest } from '../../../..'
import { editWordSourceAPIRequestSchema } from './schema'

interface EditEnglishWordSourceAPIProps {
  editWordSourceData: EditWordSourceAPIRequestDto
}

export const editEnglishWordSourceAPI = async ({
  editWordSourceData
}: EditEnglishWordSourceAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(editWordSourceAPIRequestSchema, editWordSourceData)
  if (invalid) return invalid

  const result = await post(
    '/english/word/source',
    editWordSourceData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!編集に成功しました',
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
