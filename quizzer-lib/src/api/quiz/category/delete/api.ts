import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { put } from '../../..'
import type { DeleteCategoryOfQuizAPIRequestDto } from './dto'
import type { QuizWithCategoryApiResponseDto } from '../..'

interface DeleteCategoryOfQuizAPIProps {
  deleteCategoryOfQuizRequestData: DeleteCategoryOfQuizAPIRequestDto
}

export const deleteCategoryOfQuizAPI = async ({
  deleteCategoryOfQuizRequestData
}: DeleteCategoryOfQuizAPIProps): Promise<ApiResult> => {
  if (
    !deleteCategoryOfQuizRequestData.quiz_ids ||
    deleteCategoryOfQuizRequestData.quiz_ids.length === 0
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  const result = await put(
    '/quiz/category',
    {
      ...deleteCategoryOfQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        const result = data.body as QuizWithCategoryApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004),
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
