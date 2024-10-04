import { ApiResult, get, ProcessingApiReponse } from '../../api'
import {
  GetAccuracyRateByCategoryAPIResponseDto,
  GetCategoryRateAPIRequestDto
} from './dto'

interface GetAccuracyProps {
  getCategoryRateData: GetCategoryRateAPIRequestDto
}

export const getAccuracyRateByCategoryAPI = async ({
  getCategoryRateData
}: GetAccuracyProps): Promise<ApiResult> => {
  if (getCategoryRateData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await get(
    '/category/rate',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetAccuracyRateByCategoryAPIResponseDto =
          data.body as GetAccuracyRateByCategoryAPIResponseDto
        // setAccuracyData(res);
        return {
          message: {
            message: '　',
            messageColor: 'common.black',
            isDisplay: false
          },
          result
        }
      } else if (data.status === 404) {
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
    { ...getCategoryRateData }
  )
  return result
}
