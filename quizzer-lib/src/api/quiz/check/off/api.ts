import type { CheckQuizAPIRequestDto, QuizApiResponseDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { put } from '../../..'

interface CheckOffQuizButtonProps {
  checkQuizRequestData: CheckQuizAPIRequestDto
}

export const checkOffQuizAPI = async ({
  checkQuizRequestData
}: CheckOffQuizButtonProps): Promise<ApiResult> => {
  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return { message: errorMessage(MESSAGES.ERROR.MSG00007) }
  }

  const result = await put(
    '/quiz/uncheck',
    {
      ...checkQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result = data.body as QuizApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00005),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
