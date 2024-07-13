import { get, ApiResult, ProcessingApiReponse } from '../../../api'
import { GetWordDetailAPIResponseDto } from '.'

interface GetWordDetailAPIProps {
  id: string
}

export const getWordDetailAPI = async ({
  id
}: GetWordDetailAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/english/word/' + id,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetWordDetailAPIResponseDto =
          data.body as GetWordDetailAPIResponseDto
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
