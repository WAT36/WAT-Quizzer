import type { ApiResult, ProcessingApiReponse } from '../..'
import { get } from '../..'
import type { CategoryQuizCountDto, GetCategoryQuizCountAPIRequestDto } from './dto'

interface GetCategoryQuizCountAPIProps {
  getCategoryQuizCountData: GetCategoryQuizCountAPIRequestDto
}

export const getCategoryQuizCountAPI = async ({
  getCategoryQuizCountData
}: GetCategoryQuizCountAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category/count',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: CategoryQuizCountDto[] = data.body as CategoryQuizCountDto[]
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
    { file_num: getCategoryQuizCountData.file_num }
  )
  return result
}
