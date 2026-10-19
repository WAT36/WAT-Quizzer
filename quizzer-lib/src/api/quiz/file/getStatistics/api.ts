import type { QuizFileStatisticsApiResponse } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'

interface GetQuizFileStatisticsDataButtonProps {
  file_num?: number
}

export const getQuizFileStatisticsDataAPI = async ({
  file_num
}: GetQuizFileStatisticsDataButtonProps): Promise<ApiResult> => {
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
    { file_num: file_num || -1 }
  )
  return result
}
