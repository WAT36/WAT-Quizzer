import type { GetQuizApiResponseDto } from '../get'
import type { ApiResult } from '../..'
import { post, onSuccess } from '../..'
import type { FailQuizAPIRequestDto } from './dto'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface FailQuizAPIProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const failQuizAPI = async ({
  getQuizResponseData
}: FailQuizAPIProps): Promise<ApiResult> => {
  if (getQuizResponseData.file_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (getQuizResponseData.quiz_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00007) }
  } else if (
    !getQuizResponseData.quiz_sentense ||
    !getQuizResponseData.answer
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00008) }
  }

  const result = await post(
    '/quiz/fail',
    {
      quiz_id: getQuizResponseData.id
    } as FailQuizAPIRequestDto,
    onSuccess(() => {
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00011,
          String(getQuizResponseData.quiz_num)
        )
      }
    })
  )
  return result
}
