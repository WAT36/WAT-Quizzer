import type {
  AnswerLogStatisticsApiResponse,
  GetAnswerLogStatisticsAPIRequestDto
} from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../..'
import type { ProcessingApiReponse } from '../..'
import { get } from '../..'

interface GetAnswerLogStatisticsAPIProps {
  getAnswerLogStatisticsData: GetAnswerLogStatisticsAPIRequestDto
}

export const getAnswerLogStatisticsDataAPI = async ({
  getAnswerLogStatisticsData
}: GetAnswerLogStatisticsAPIProps) => {
  const result = await get(
    '/quiz/statistics',
    (data: ProcessingApiReponse) => {
      if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else if (data.status === 200) {
        const result: AnswerLogStatisticsApiResponse[] =
          data.body as AnswerLogStatisticsApiResponse[]
        return {
          message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    { ...getAnswerLogStatisticsData }
  )
  return result
}
