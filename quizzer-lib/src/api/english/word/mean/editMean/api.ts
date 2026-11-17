import type { ApiResult } from '../../../..'
import { patch, onSuccess, validateRequest } from '../../../..'
import { editWordMeanAPIRequestSchema } from './schema'
import type { EditWordMeanAPIRequestDto } from '.'

interface EditEnglishWordMeanButtonProps {
  editMeanData: EditWordMeanAPIRequestDto
}

export const editEnglishWordMeanAPI = async ({
  editMeanData
}: EditEnglishWordMeanButtonProps): Promise<ApiResult> => {
  const invalid = validateRequest(editWordMeanAPIRequestSchema, editMeanData)
  if (invalid) return invalid

  const result = await patch(
    '/english/word/' + String(editMeanData.wordId),
    editMeanData,
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
