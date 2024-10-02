import { AddQuizApiResponseDto } from '../../../..'
import { del, ApiResult, ProcessingApiReponse } from '../../../api'
import { DeleteQuizFileApiRequest } from './dto'

interface DeleteQuizFileAPIProps {
  deleteQuizFileApiRequest: DeleteQuizFileApiRequest
}

export const deleteQuizFileAPI = async ({
  deleteQuizFileApiRequest
}: DeleteQuizFileAPIProps): Promise<ApiResult> => {
  const result = await del(
    '/quiz/file',
    {
      ...deleteQuizFileApiRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message: `ファイルを削除しました(id:${deleteQuizFileApiRequest.file_id})`,
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
