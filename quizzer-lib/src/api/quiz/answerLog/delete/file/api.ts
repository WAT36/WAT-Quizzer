import { MESSAGES, successMessage } from '../../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../../..'
import { patch, onSuccess, validateRequest } from '../../../..'
import { deleteAnswerLogOfFileApiRequestSchema } from './schema'
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
  // ファイル未選択(-1)なら送らない
  const invalid = validateRequest(
    deleteAnswerLogOfFileApiRequestSchema,
    deleteLogOfFileRequest,
    () => MESSAGES.ERROR.MSG00001
  )
  if (invalid) return invalid

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
