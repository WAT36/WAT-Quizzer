import type { AddSayingAPIRequestDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess } from '../..'
import type { AddQuizApiResponseDto } from '../../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface AddSayingButtonProps {
  addSayingAPIRequest: AddSayingAPIRequestDto
}

export const addSayingAPI = async ({
  addSayingAPIRequest
}: AddSayingButtonProps): Promise<ApiResult> => {
  if (!addSayingAPIRequest.book_id || addSayingAPIRequest.book_id === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00011) }
  } else if (!addSayingAPIRequest.saying || addSayingAPIRequest.saying === '') {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00012) }
  }

  const result = await post(
    '/saying',
    {
      ...addSayingAPIRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00016,
          addSayingAPIRequest.saying
        ),
        result
      }
    })
  )
  return result
}
