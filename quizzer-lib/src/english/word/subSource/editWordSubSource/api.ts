import { EditWordSubSourceAPIRequestDto } from '.'
import { ProcessingApiReponse, post } from '../../../../api'

interface EditEnglishWordSubSourceButtonProps {
  editWordSubSourceData: EditWordSubSourceAPIRequestDto
}

export const editEnglishWordSubSourceAPI = async ({
  editWordSubSourceData
}: EditEnglishWordSubSourceButtonProps) => {
  if (
    !editWordSubSourceData.subSource ||
    editWordSubSourceData.subSource === ''
  ) {
    return {
      message: {
        message: 'エラー:サブ出典を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/english/word/subsource',
    editWordSubSourceData,
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
