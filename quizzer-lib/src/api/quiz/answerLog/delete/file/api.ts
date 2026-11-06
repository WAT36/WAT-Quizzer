import { MESSAGES, successMessage } from '../../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../../..'
import { patch, onSuccess } from '../../../..'
import type {
  DeleteAnswerLogOfFileApiRequestDto,
  DeleteAnswerLogOfFileApiResponseDto
} from './dto'

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
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as DeleteAnswerLogOfFileApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00003,
          String(deleteLogOfFileRequest.file_id)
        ),
        result
      }
    })
  )
  return result
}
