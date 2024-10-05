import { AddSayingAPIRequestDto } from './dto'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../..'

interface AddSayingButtonProps {
  addSayingAPIRequest: AddSayingAPIRequestDto
}

export const addSayingAPI = async ({
  addSayingAPIRequest
}: AddSayingButtonProps): Promise<ApiResult> => {
  if (!addSayingAPIRequest.book_id || addSayingAPIRequest.book_id === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00011) }
  } else if (!addSayingAPIRequest.saying || addSayingAPIRequest.saying === '') {
    return { message: errorMessage(MESSAGES.ERROR.MSG00012) }
  }

  const result = await post(
    '/saying',
    {
      ...addSayingAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00016),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
