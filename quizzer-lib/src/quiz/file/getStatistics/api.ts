import { QuizFileStatisticsApiResponse } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../..'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

interface GetQuizFileStatisticsDataButtonProps {}

export const getQuizFileStatisticsDataAPI =
  async ({}: GetQuizFileStatisticsDataButtonProps): Promise<ApiResult> => {
    const result = get(
      '/quiz/file/statistics',
      (data: ProcessingApiReponse) => {
        if (data.status === 404) {
          return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
        } else if (data.status === 200) {
          const result: QuizFileStatisticsApiResponse[] =
            data.body as QuizFileStatisticsApiResponse[]
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
