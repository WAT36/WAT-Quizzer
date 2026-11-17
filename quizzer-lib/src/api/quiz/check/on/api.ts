import type { CheckQuizAPIRequestDto, QuizApiResponseDto } from '../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { put, onSuccess, validateRequest } from '../../..'
import { checkQuizAPIRequestSchema } from '../schema'

interface CheckOnQuizButtonProps {
  checkQuizRequestData: CheckQuizAPIRequestDto
}

export const checkOnQuizAPI = async ({
  checkQuizRequestData
}: CheckOnQuizButtonProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    checkQuizAPIRequestSchema,
    checkQuizRequestData,
    () => MESSAGES.ERROR.MSG00007
  )
  if (invalid) return invalid

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
