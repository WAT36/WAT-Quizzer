import type {
  GetQuizApiResponseDto,
  QuizApiResponseDto,
  ReverseCheckQuizAPIRequestDto
} from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess } from '../../..'

interface ReverseCheckQuizAPIProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const reverseCheckQuizAPI = async ({
  getQuizResponseData
}: ReverseCheckQuizAPIProps): Promise<ApiResult> => {
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

  const requestData: ReverseCheckQuizAPIRequestDto = {
    quiz_id: getQuizResponseData.id
  }
  const result = await post(
    '/quiz/check',
    requestData,
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as QuizApiResponseDto
      return {
        message: successMessage(
          result.checked
            ? MESSAGES.SUCCESS.MSG00006
            : MESSAGES.SUCCESS.MSG00007,
          String(getQuizResponseData.quiz_num)
        ),
        result
      }
    })
  )
  return result
}
