import type { CheckQuizAPIRequestDto, QuizApiResponseDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { put, onSuccess } from '../../..'

interface CheckOnQuizButtonProps {
  checkQuizRequestData: CheckQuizAPIRequestDto
}

export const checkOnQuizAPI = async ({
  checkQuizRequestData
}: CheckOnQuizButtonProps): Promise<ApiResult> => {
  if (
    !checkQuizRequestData.quiz_ids ||
    checkQuizRequestData.quiz_ids.length === 0
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00007) }
  }

  const result = await put(
    '/quiz/check',
    {
      ...checkQuizRequestData
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as QuizApiResponseDto[]
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00005),
        result
      }
    })
  )
  return result
}
