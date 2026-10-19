import type { ApiResult, ProcessingApiReponse } from '../..'
import { get } from '../..'
import type {
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

  const { format_id: formatMap, ...rest } = getCategoryRateData
  const format_id = formatMap
    ? Object.entries(formatMap)
        .filter(([, enabled]) => !!enabled)
        .map(([key]) => key)
        .join(',')
    : ''

  const queryParam: { [key: string]: string | number } = {
    file_num: rest.file_num
  }

  if (rest.startDate) {
    queryParam.startDate = rest.startDate
  }
  if (rest.endDate) {
    queryParam.endDate = rest.endDate
  }
  if (format_id) {
    queryParam.format_id = format_id
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
    queryParam
  )
  return result
}
