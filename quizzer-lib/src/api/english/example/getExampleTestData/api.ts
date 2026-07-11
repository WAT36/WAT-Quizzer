import {
  GetExampleTestDataAPIRequestDto,
  GetExampleTestDataAPIResponseDto
} from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../..'

interface GetExampleTestDataAPIProps {
  getExampleTestData: GetExampleTestDataAPIRequestDto
}

export const getExampleTestDataAPI = async ({
  getExampleTestData
}: GetExampleTestDataAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/english/example/test',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body) {
        const result: GetExampleTestDataAPIResponseDto =
          data.body as GetExampleTestDataAPIResponseDto
        return {
          message: {
            message: '　',
            messageColor: 'common.black',
            isDisplay: false
          },
          result,
          total: result.total
        }
      } else if (data.status === 404 || !data.body) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
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
    { ...getExampleTestData }
  )
  return result
}
