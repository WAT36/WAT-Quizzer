import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../../../'
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
          message: successMessage(
            MESSAGES.SUCCESS.MSG00003,
            String(deleteLogOfFileRequest.file_id)
          ),
          result
        }
      } else {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00004),
          result
        }
      }
    }
  )
  return result
}
