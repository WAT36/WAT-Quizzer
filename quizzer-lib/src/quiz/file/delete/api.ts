import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
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
          message: successMessage(
            MESSAGES.SUCCESS.MSG00013,
            String(deleteQuizFileApiRequest.file_id)
          ),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
