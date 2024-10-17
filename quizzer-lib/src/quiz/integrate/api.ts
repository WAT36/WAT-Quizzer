import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../..'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { IntegrateToQuizAPIRequestDto } from './dto'

interface IntegrateQuizAPIProps {
  integrateToQuizAPIRequestData: IntegrateToQuizAPIRequestDto
}

export const integrateQuizAPI = async ({
  integrateToQuizAPIRequestData
}: IntegrateQuizAPIProps): Promise<ApiResult> => {
  if (
    !integrateToQuizAPIRequestData.fromQuizId ||
    !integrateToQuizAPIRequestData.toQuizId
  ) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00010) }
  }

  const result = await post(
    '/quiz/integrate',
    {
      ...integrateToQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
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
