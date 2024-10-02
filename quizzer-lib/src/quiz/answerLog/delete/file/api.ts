import { AddQuizApiResponseDto } from '../../../../../'
import { patch, ApiResult, ProcessingApiReponse } from '../../../../api'
import { DeleteAnswerLogOfFileApiRequestDto } from './dto'

interface DeleteAnswerLogOfFileAPIProps {
  deleteLogOfFileRequest: DeleteAnswerLogOfFileApiRequestDto
}

export const deleteAnswerLogOfQuizFileAPI = async ({
  deleteLogOfFileRequest
}: DeleteAnswerLogOfFileAPIProps): Promise<ApiResult> => {
  const result = await patch(
    '/quiz/answer_log/file',
    {
      ...deleteLogOfFileRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message: `回答ログを削除しました(id:${deleteLogOfFileRequest.file_id})`,
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      }
    }
  )
  return result
}
