import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'
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
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
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
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    },
    { file_num: getCategoryParentChildListData.file_num }
  )
  return result
}
