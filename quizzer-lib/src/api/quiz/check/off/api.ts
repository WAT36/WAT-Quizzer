import type { CheckQuizAPIRequestDto, QuizApiResponseDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { put, onSuccess } from '../../..'

interface CheckOffQuizButtonProps {
  checkQuizRequestData: CheckQuizAPIRequestDto
}

export const checkOffQuizAPI = async ({
  checkQuizRequestData
}: CheckOffQuizButtonProps): Promise<ApiResult> => {
  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00007) }
  }

  const result = await put(
    '/quiz/uncheck',
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
