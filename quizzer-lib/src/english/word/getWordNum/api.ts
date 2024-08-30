import { get, ApiResult, ProcessingApiReponse } from '../../../api'
import { GetWordNumResponseDto } from './dto'

interface GetWordNumAPIProps {}

export const getWordNumAPI =
  async ({}: GetWordNumAPIProps): Promise<ApiResult> => {
    const result = await get(
      '/english/word/num',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: GetWordNumResponseDto =
            data.body as GetWordNumResponseDto
          return {
            message: {
              message: 'Success!!取得しました',
              messageColor: 'success.light',
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
    )
    return result
  }
