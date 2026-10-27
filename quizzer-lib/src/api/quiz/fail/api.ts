import type { GetQuizApiResponseDto } from '../get'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post } from '../..'
import type { FailQuizAPIRequestDto } from './dto'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface FailQuizButtonProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const failQuizAPI = async ({
  getQuizResponseData
}: FailQuizButtonProps): Promise<ApiResult> => {
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
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00011,
            String(getQuizResponseData.quiz_num)
          )
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
