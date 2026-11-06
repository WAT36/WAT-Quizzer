import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type { GetWordDetailAPIResponseDto } from '.'

interface GetWordDetailAPIProps {
  id: string
}

export const getWordDetailAPI = async ({
  id
}: GetWordDetailAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/english/word/' + id,
    onSuccess((data: ProcessingApiReponse) => {
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
    }),
    {}
  )
  return result
}
