import type { AddQuizApiResponseDto } from '../../../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess } from '../../..'
import type { AddBookAPIRequestDto } from './dto'

interface AddBookButtonProps {
  addBookAPIRequest: AddBookAPIRequestDto
}

export const addBookAPI = async ({
  addBookAPIRequest
}: AddBookButtonProps): Promise<ApiResult> => {
  if (!addBookAPIRequest.book_name || addBookAPIRequest.book_name === '') {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00013) }
  }

  const result = await post(
    '/saying/book',
    {
      ...addBookAPIRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00017,
          addBookAPIRequest.book_name
        ),
        result
      }
    })
  )
  return result
}
