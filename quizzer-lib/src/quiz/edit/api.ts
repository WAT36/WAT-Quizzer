import { EditQuizAPIRequestDto, EditQuizApiResponseDto } from './dto'
import { ApiResult, post, ProcessingApiReponse } from '../../api'

interface EditQuizAPIProps {
  editQuizRequestData: EditQuizAPIRequestDto
}

export const editQuizAPI = async ({
  editQuizRequestData
}: EditQuizAPIProps): Promise<ApiResult> => {
  if (editQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (!editQuizRequestData.question || !editQuizRequestData.answer) {
    return {
      message: {
        message: 'エラー:問題文及び答えを入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/quiz/edit',
    {
      ...editQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: EditQuizApiResponseDto =
          data.body as EditQuizApiResponseDto

        //入力データをクリア
        const inputQuizField = document
          .getElementsByTagName('textarea')
          .item(0) as HTMLTextAreaElement
        if (inputQuizField) {
          inputQuizField.value = ''
        }

        return {
          message: {
            message: 'Success!! 問題を更新できました!',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
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
  )
  return result
}
