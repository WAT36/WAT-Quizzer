import type { EditWordSubSourceAPIRequestDto } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../../..'
import { post } from '../../../..'

interface EditEnglishWordSubSourceButtonProps {
  editWordSubSourceData: EditWordSubSourceAPIRequestDto
}

export const editEnglishWordSubSourceAPI = async ({
  editWordSubSourceData
}: EditEnglishWordSubSourceButtonProps): Promise<ApiResult> => {
  if (
    !editWordSubSourceData.subSource ||
    editWordSubSourceData.subSource === ''
  ) {
    return {
      isSuccess: false,
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
