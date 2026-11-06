import type { EditWordSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess } from '../../../..'

interface EditEnglishWordSourceAPIProps {
  editWordSourceData: EditWordSourceAPIRequestDto
}

export const editEnglishWordSourceAPI = async ({
  editWordSourceData
}: EditEnglishWordSourceAPIProps): Promise<ApiResult> => {
  if (editWordSourceData.sourceId === -1) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:出典を選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

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
