import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type {
  CategoryParentChildAPIResponseDto,
  GetCategoryParentChildListAPIRequestDto
} from '../dto'

interface GetCategoryParentChildListAPIProps {
  getCategoryParentChildListData: GetCategoryParentChildListAPIRequestDto
}

export const getCategoryParentChildListAPI = async ({
  getCategoryParentChildListData
}: GetCategoryParentChildListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category/parent-child',
    onSuccess((data: ProcessingApiReponse) => {
      const result: CategoryParentChildAPIResponseDto[] =
        data.body as CategoryParentChildAPIResponseDto[]
      return {
        message: {
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        },
        result
      }
    }),
    { file_num: getCategoryParentChildListData.file_num }
  )
  return result
}
