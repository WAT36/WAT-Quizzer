import { DeleteWordSubSourceAPIRequestDto } from '.'
import { ProcessingApiReponse, del } from '../../../../api'

interface DeleteWordSubSourceAPIProps {
  deleteWordSubSourceData: DeleteWordSubSourceAPIRequestDto
}

export const deleteEnglishWordSubSourceAPI = async ({
  deleteWordSubSourceData
}: DeleteWordSubSourceAPIProps) => {
  if (!deleteWordSubSourceData.id || deleteWordSubSourceData.id === -1) {
    return {
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
  return result
}
