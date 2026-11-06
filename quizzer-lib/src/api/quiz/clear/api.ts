import type { GetQuizApiResponseDto } from '../get'
import type { ApiResult } from '../..'
import { post, onSuccess } from '../..'
import type { ClearQuizAPIRequestDto } from './dto'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface ClearQuizButtonProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const clearQuizAPI = async ({
  getQuizResponseData
}: ClearQuizButtonProps): Promise<ApiResult> => {
  if (getQuizResponseData.file_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (getQuizResponseData.quiz_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00007) }
  } else if (
    !getQuizResponseData.quiz_sentense ||
    !getQuizResponseData.answer
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00008) }
  }

  const result = await post(
    '/quiz/clear',
    {
      quiz_id: getQuizResponseData.id
    } as ClearQuizAPIRequestDto,
    onSuccess(() => {
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00008,
          String(getQuizResponseData.quiz_num)
        )
      }
    })
  )
  return result
}
