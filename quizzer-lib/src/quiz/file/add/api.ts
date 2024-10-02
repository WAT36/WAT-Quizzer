import { AddQuizApiResponseDto } from '../../../..'
import { post, ApiResult, ProcessingApiReponse } from '../../../api'
import { AddQuizFileApiRequest } from './dto'

interface AddQuizFileAPIProps {
  addQuizFileApiRequest: AddQuizFileApiRequest
}

export const addQuizFileAPI = async ({
  addQuizFileApiRequest
}: AddQuizFileAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/quiz/file',
    {
      ...addQuizFileApiRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message: `新規ファイル「${addQuizFileApiRequest.file_nickname}」を追加しました`,
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
