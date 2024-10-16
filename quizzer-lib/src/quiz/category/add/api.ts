import { AddCategoryToQuizAPIRequestDto } from './dto'
import {
  AddAPIResponseDto,
  ApiResult,
  post,
  ProcessingApiReponse
} from '../../../api'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface AddCategoryToQuizAPIProps {
  addCategoryToQuizRequestData: AddCategoryToQuizAPIRequestDto
}

export const addCategoryToQuizAPI = async ({
  addCategoryToQuizRequestData
}: AddCategoryToQuizAPIProps): Promise<ApiResult> => {
  if (
    !addCategoryToQuizRequestData.quiz_id ||
    addCategoryToQuizRequestData.quiz_id === ''
  ) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    }
  }

  const result = await post(
    '/quiz/category',
    {
      ...addCategoryToQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        const result: AddAPIResponseDto = data.body as AddAPIResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004),
          result
        }
      } else if (data.status === 404) {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00003)
        }
      } else {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00004)
        }
      }
    }
  )
  return result
}
