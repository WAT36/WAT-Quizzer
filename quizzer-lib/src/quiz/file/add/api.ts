import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
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
          message: successMessage(
            MESSAGES.SUCCESS.MSG00012,
            String(addQuizFileApiRequest.file_nickname)
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
