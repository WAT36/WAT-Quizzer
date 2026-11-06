import type { DeleteWordSubSourceAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { del, onSuccess } from '../../../..'

interface DeleteWordSubSourceAPIProps {
  deleteWordSubSourceData: DeleteWordSubSourceAPIRequestDto
}

export const deleteEnglishWordSubSourceAPI = async ({
  deleteWordSubSourceData
}: DeleteWordSubSourceAPIProps): Promise<ApiResult> => {
  if (!deleteWordSubSourceData.id || deleteWordSubSourceData.id === -1) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:サブ出典を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

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
