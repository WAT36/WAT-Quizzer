import type {
  AccuracyRateHistgramApiResponse,
  GetAccuracyRateHistgramAPIRequestDto
} from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'

interface GetAccuracyRateHistgramAPIProps {
  getAccuracyRateHistgramData: GetAccuracyRateHistgramAPIRequestDto
}

export const getAccuracyRateHistgramDataAPI = async ({
  getAccuracyRateHistgramData
}: GetAccuracyRateHistgramAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/quiz/statistics/histgram',
    (data: ProcessingApiReponse) => {
      if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else if (data.status === 200) {
        const result: AccuracyRateHistgramApiResponse[] =
          data.body as AccuracyRateHistgramApiResponse[]
        return {
          message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    { ...getAccuracyRateHistgramData }
  )
  return result
}
