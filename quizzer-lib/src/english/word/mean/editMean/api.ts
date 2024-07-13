import { patch, ApiResult, ProcessingApiReponse } from '../../../../api'
import { EditWordMeanAPIRequestDto } from '.'

interface EditEnglishWordMeanButtonProps {
  editMeanData: EditWordMeanAPIRequestDto
}

export const editEnglishWordMeanAPI = async ({
  editMeanData
}: EditEnglishWordMeanButtonProps): Promise<ApiResult> => {
  if (editMeanData.partofspeechId === -1) {
    return {
      message: {
        message: 'エラー:品詞を選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await patch(
    '/english/word/' + String(editMeanData.wordId),
    editMeanData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!編集に成功しました',
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
