import { GetQuizApiResponseDto } from '../get'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { errorMessage, MESSAGES, successMessage } from '../../..'

interface FailQuizButtonProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const failQuizAPI = async ({
  getQuizResponseData
}: FailQuizButtonProps): Promise<ApiResult> => {
  if (getQuizResponseData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (getQuizResponseData.quiz_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00007) }
  } else if (
    !getQuizResponseData.quiz_sentense ||
    !getQuizResponseData.answer
  ) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00008) }
  }

  const result = await post(
    '/quiz/fail',
    {
      quiz_id: getQuizResponseData.id,
      format_id: getQuizResponseData.format_id,
      file_num: getQuizResponseData.file_num,
      quiz_num: getQuizResponseData.quiz_num
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00011,
            String(getQuizResponseData.quiz_num)
          )
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
