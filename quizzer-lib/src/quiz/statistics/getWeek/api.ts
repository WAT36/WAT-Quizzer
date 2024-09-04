import { QuizStatisticsWeekApiResponse } from '.'
import { get, ProcessingApiReponse } from '../../../api'

interface GetQuizStatisticsWeekAPIProps {}

export const getQuizStatisticsWeekDataAPI =
  async ({}: GetQuizStatisticsWeekAPIProps) => {
    const result = await get(
      '/quiz/statistics/week',
      (data: ProcessingApiReponse) => {
        if (data.status === 404) {
          return {
            message: {
              message: 'エラー:条件に合致するデータはありません',
              messageColor: 'error',
              isDisplay: true
            }
          }
        } else if (data.status === 200) {
          const result: QuizStatisticsWeekApiResponse[] =
            data.body as QuizStatisticsWeekApiResponse[]
          return {
            message: {
              message: '　',
              messageColor: 'common.black',
              isDisplay: false
            },
            result
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
      {}
    )
    return result
  }
