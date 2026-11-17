import type { QuizWithCategoryApiResponseDto } from '..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, validateRequest } from '../..'
import { integrateToQuizAPIRequestSchema } from './schema'
import type { IntegrateToQuizAPIRequestDto } from './dto'

interface IntegrateQuizAPIProps {
  integrateToQuizAPIRequestData: IntegrateToQuizAPIRequestDto
}

export const integrateQuizAPI = async ({
  integrateToQuizAPIRequestData
}: IntegrateQuizAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    integrateToQuizAPIRequestSchema,
    integrateToQuizAPIRequestData,
    () => MESSAGES.ERROR.MSG00010
  )
  if (invalid) return invalid

  const result = await post(
    '/quiz/integrate',
    {
      ...integrateToQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result = data.body as QuizWithCategoryApiResponseDto
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00014,
            'ID',
            String(integrateToQuizAPIRequestData.fromQuizId),
            String(integrateToQuizAPIRequestData.toQuizId)
          ),
          result
        }
      } else if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
