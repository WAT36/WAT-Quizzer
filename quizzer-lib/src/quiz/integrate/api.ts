import { errorMessage, MESSAGES, successMessage } from '../../..'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { IntegrateToQuizAPIRequestDto } from './dto'

interface IntegrateQuizAPIProps {
  integrateToQuizAPIRequestData: IntegrateToQuizAPIRequestDto
}

export const integrateQuizAPI = async ({
  integrateToQuizAPIRequestData
}: IntegrateQuizAPIProps): Promise<ApiResult> => {
  if (
    !integrateToQuizAPIRequestData.file_num ||
    !integrateToQuizAPIRequestData.fromQuizInfo.quiz_num ||
    !integrateToQuizAPIRequestData.toQuizInfo.quiz_num
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
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00014,
            String(integrateToQuizAPIRequestData.file_num),
            String(integrateToQuizAPIRequestData.fromQuizInfo.quiz_num),
            String(integrateToQuizAPIRequestData.toQuizInfo.quiz_num)
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
