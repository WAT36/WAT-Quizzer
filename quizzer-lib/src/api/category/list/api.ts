import type { ApiResult, ProcessingApiReponse } from '../..'
import { get, onSuccess } from '../..'
import type { GetCategoryAPIResponseDto, GetCategoryListAPIRequestDto } from '.'

interface GetCategoryListAPIProps {
  getCategoryListData: GetCategoryListAPIRequestDto
}

export const getCategoryListAPI = async ({
  getCategoryListData
}: GetCategoryListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category',
    onSuccess((data: ProcessingApiReponse) => {
      const result: GetCategoryAPIResponseDto[] =
        data.body as GetCategoryAPIResponseDto[]
      return {
        message: {
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        },
        result
      }
    }),
    { ...getCategoryListData }
  )
  return result
}
