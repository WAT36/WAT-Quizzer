import type { AddQuizApiResponseDto } from '../../../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess } from '../../..'
import type { AddQuizFileApiRequest } from './dto'

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
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00012,
          String(addQuizFileApiRequest.file_nickname)
        ),
        result
      }
    })
  )
  return result
}
