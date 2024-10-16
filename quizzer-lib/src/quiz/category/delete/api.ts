import { errorMessage, MESSAGES, successMessage } from '../../../..'
import {
  AddAPIResponseDto,
  ApiResult,
  ProcessingApiReponse,
  put
} from '../../../api'
import { AddCategoryToQuizAPIRequestDto } from '../add/dto'

interface DeleteCategoryOfQuizAPIProps {
  // TODO プロパティ同じだからAddCategoryToQuizAPIRequestDto流用してるが、、deleteで使うのは変なので名前変えたい
  deleteCategoryToQuizRequestData: AddCategoryToQuizAPIRequestDto
}

export const deleteCategoryOfQuizAPI = async ({
  deleteCategoryToQuizRequestData
}: DeleteCategoryOfQuizAPIProps): Promise<ApiResult> => {
  if (
    !deleteCategoryToQuizRequestData.quiz_id ||
    deleteCategoryToQuizRequestData.quiz_id === ''
  ) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  const result = await put(
    '/quiz/category',
    {
      ...deleteCategoryToQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        const result: AddAPIResponseDto = data.body as AddAPIResponseDto
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
