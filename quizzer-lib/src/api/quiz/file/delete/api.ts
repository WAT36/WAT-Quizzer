import type { AddQuizApiResponseDto } from '../../../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { del, onSuccess } from '../../..'
import type { DeleteQuizFileApiRequest } from './dto'

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
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00013,
          String(deleteQuizFileApiRequest.file_id)
        ),
        result
      }
    })
  )
  return result
}
