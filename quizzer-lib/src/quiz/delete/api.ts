import { AddQuizApiResponseDto } from '../../..'
import { ApiResult, del, ProcessingApiReponse } from '../../api'
import { DeleteQuizAPIRequestDto } from './dto'

interface DeleteQuizAPIProps {
  deleteQuizAPIRequestData: DeleteQuizAPIRequestDto
}
export const deleteQuiz = async ({
  deleteQuizAPIRequestData
}: DeleteQuizAPIProps): Promise<ApiResult> => {
  if (
    !deleteQuizAPIRequestData.file_num ||
    !deleteQuizAPIRequestData.quiz_num
  ) {
    return {
      message: {
        message: 'エラー:削除する問題を取得して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await del(
    '/quiz',
    {
      ...deleteQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message:
              'Success! 削除に成功しました [' +
              deleteQuizAPIRequestData.file_num +
              '-' +
              deleteQuizAPIRequestData.quiz_num +
              ']',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (data.status === 404) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
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
  )
  return result
}
