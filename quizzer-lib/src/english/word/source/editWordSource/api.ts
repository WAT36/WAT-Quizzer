import { EditWordSourceAPIRequestDto } from '.'
import { ProcessingApiReponse, post } from '../../../../api'

interface EditEnglishWordSourceAPIProps {
  editWordSourceData: EditWordSourceAPIRequestDto
}

export const editEnglishWordSourceAPI = async ({
  editWordSourceData
}: EditEnglishWordSourceAPIProps) => {
  if (editWordSourceData.newSourceId === -1) {
    return {
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
