import { CheckQuizAPIRequestDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'
import {
  AddAPIResponseDto,
  ApiResult,
  ProcessingApiReponse,
  put
} from '../../../api'

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
        const result: AddAPIResponseDto = data.body as AddAPIResponseDto
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
