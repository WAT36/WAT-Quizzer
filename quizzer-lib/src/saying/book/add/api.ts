import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../../'
import { post, ApiResult, ProcessingApiReponse } from '../../../api'
import { AddBookAPIRequestDto } from './dto'

interface AddBookButtonProps {
  addBookAPIRequest: AddBookAPIRequestDto
}

export const addBookAPI = async ({
  addBookAPIRequest
}: AddBookButtonProps): Promise<ApiResult> => {
  if (!addBookAPIRequest.book_name || addBookAPIRequest.book_name === '') {
    return { message: errorMessage(MESSAGES.ERROR.MSG00013) }
  }

  const result = await post(
    '/saying/book',
    {
      ...addBookAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00017,
            addBookAPIRequest.book_name
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
