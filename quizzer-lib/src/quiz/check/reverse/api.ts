import { GetQuizApiResponseDto } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'
import { ApiResult, post, ProcessingApiReponse } from '../../../api'

interface ReverseCheckQuizButtonProps {
  // TODO GetQuizApiResponseDto?? CheckQuizAPIRequestDto使え
  getQuizResponseData: GetQuizApiResponseDto
}

export const reverseCheckQuizAPI = async ({
  getQuizResponseData
}: ReverseCheckQuizButtonProps): Promise<ApiResult> => {
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
    '/quiz/check',
    {
      format: getQuizResponseData.format,
      file_num: getQuizResponseData.file_num,
      quiz_num: getQuizResponseData.quiz_num
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
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
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
