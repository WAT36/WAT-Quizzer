import {
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIResponseDto
} from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../../../api'

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
          result
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
    { ...getEnglishWordTestData }
  )
  return result
}
