import { errorMessage, MESSAGES, successMessage } from '../../../..'
import type { RecommendedCategoryDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { get } from '../..'

interface GetRecommendedCategoriesProps {
  file_num: number
}

export const getRecommendedCategoriesAPI = async ({
  file_num
}: GetRecommendedCategoriesProps): Promise<ApiResult> => {
  if (file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  return await get(
    '/quiz/recommend-categories',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body) {
        const result = data.body as RecommendedCategoryDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00019),
          result
        }
      } else if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    { file_num }
  )
}
