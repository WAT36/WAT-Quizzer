import type { ApiResult, ProcessingApiReponse } from '../..'
import { get, onSuccess } from '../..'
import type {
  CategoryQuizCountDto,
  GetCategoryQuizCountAPIRequestDto
} from './dto'

interface GetCategoryQuizCountAPIProps {
  getCategoryQuizCountData: GetCategoryQuizCountAPIRequestDto
}

export const getCategoryQuizCountAPI = async ({
  getCategoryQuizCountData
}: GetCategoryQuizCountAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category/count',
    onSuccess((data: ProcessingApiReponse) => {
      const result: CategoryQuizCountDto[] = data.body as CategoryQuizCountDto[]
      return {
        message: {
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        },
        result
      }
    }),
    { file_num: getCategoryQuizCountData.file_num }
  )
  return result
}
