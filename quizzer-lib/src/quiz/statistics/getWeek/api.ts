import { QuizStatisticsWeekApiResponse } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../..'
import { get, ProcessingApiReponse } from '../../../api'

interface GetQuizStatisticsWeekAPIProps {}

export const getQuizStatisticsWeekDataAPI =
  async ({}: GetQuizStatisticsWeekAPIProps) => {
    const result = await get(
      '/quiz/statistics/week',
      (data: ProcessingApiReponse) => {
        if (data.status === 404) {
          return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
        } else if (data.status === 200) {
          const result: QuizStatisticsWeekApiResponse[] =
            data.body as QuizStatisticsWeekApiResponse[]
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
