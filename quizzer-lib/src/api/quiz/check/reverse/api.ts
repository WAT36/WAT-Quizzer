import type { GetQuizApiResponseDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess } from '../../..'

interface ReverseCheckQuizButtonProps {
  // TODO GetQuizApiResponseDto?? CheckQuizAPIRequestDto使え
  getQuizResponseData: GetQuizApiResponseDto
}

export const reverseCheckQuizAPI = async ({
  getQuizResponseData
}: ReverseCheckQuizButtonProps): Promise<ApiResult> => {
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
    '/quiz/check',
    {
      quiz_id: getQuizResponseData.id
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto
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
