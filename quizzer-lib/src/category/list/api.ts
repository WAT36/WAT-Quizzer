import { ApiResult, get, ProcessingApiReponse } from '../../api'
import { GetCategoryAPIResponseDto, GetCategoryListAPIRequestDto } from '.'

interface GetCategoryListAPIProps {
  getCategoryListData: GetCategoryListAPIRequestDto
}

export const getCategoryListAPI = async ({
  getCategoryListData
}: GetCategoryListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
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
    { ...getCategoryListData }
  )
  return result
}
