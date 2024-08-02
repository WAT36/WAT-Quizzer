import { GetPastWeekTestStatisticsAPIResponseDto } from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../../../api'

interface GetWordTestStatisticsWeekDataAPIProps {}

export const getWordTestStatisticsWeekDataAPI =
  async ({}: GetWordTestStatisticsWeekDataAPIProps): Promise<ApiResult> => {
    const result = await get(
      '/english/word/test/statistics/week',
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
          const result: GetPastWeekTestStatisticsAPIResponseDto[] =
            data.body as GetPastWeekTestStatisticsAPIResponseDto[]

          return {
            message: {
              message: '　',
              messageColor: 'common.black',
              isDisplay: true
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
    ).catch((err) => {
      return {
        message: {
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        }
      }
    })
    return result
  }
