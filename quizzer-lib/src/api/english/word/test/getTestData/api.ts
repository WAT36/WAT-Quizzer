import type {
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIResponseDto
} from '.'
import type { ApiResult, ProcessingApiReponse } from '../../../..'
import { get } from '../../../..'

interface GetEnglishWordTestDataAPIProps {
  getEnglishWordTestData: GetEnglishWordTestDataAPIRequestDto
}

export const getEnglishWordTestDataAPI = async ({
  getEnglishWordTestData
}: GetEnglishWordTestDataAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/english/word/test',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body) {
        const result: GetEnglishWordTestDataAPIResponseDto =
          data.body as GetEnglishWordTestDataAPIResponseDto
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
          isSuccess: false,
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
        }
      } else {
        return {
          isSuccess: false,
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    },
    { ...getEnglishWordTestData }
  )
  return result
}
