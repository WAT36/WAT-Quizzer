import { QuizFileStatisticsApiResponse } from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

interface GetQuizFileStatisticsDataButtonProps {}

export const getQuizFileStatisticsDataAPI =
  async ({}: GetQuizFileStatisticsDataButtonProps): Promise<ApiResult> => {
    const result = get(
      '/quiz/file/statistics',
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
          const result: QuizFileStatisticsApiResponse[] =
            data.body as QuizFileStatisticsApiResponse[]
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
