import type { AddQuizApiResponseDto } from '../../../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess, validateRequest } from '../../..'
import { addBookAPIRequestSchema } from './schema'
import type { AddBookAPIRequestDto } from './dto'

interface AddBookButtonProps {
  addBookAPIRequest: AddBookAPIRequestDto
}

export const addBookAPI = async ({
  addBookAPIRequest
}: AddBookButtonProps): Promise<ApiResult> => {
  const invalid = validateRequest(addBookAPIRequestSchema, addBookAPIRequest)
  if (invalid) return invalid

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
