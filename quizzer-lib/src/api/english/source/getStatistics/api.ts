import type { SourceStatisticsApiResponse } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'

interface GetSourceStatisticsDataButtonProps {}

export const getSourceStatisticsDataAPI =
  async ({}: GetSourceStatisticsDataButtonProps): Promise<ApiResult> => {
    const result = get(
      '/english/source/statistics',
      (data: ProcessingApiReponse) => {
        if (data.status === 404) {
          return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
        } else if (data.status === 200) {
          const result: SourceStatisticsApiResponse[] =
            data.body as SourceStatisticsApiResponse[]
          return {
            message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
            result
          }
        } else {
          return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
        }
      },
      {}
    )
    return result
  }
