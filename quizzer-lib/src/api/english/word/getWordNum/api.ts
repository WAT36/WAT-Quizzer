import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type { GetWordNumResponseDto } from './dto'

interface GetWordNumAPIProps {}

export const getWordNumAPI =
  async ({}: GetWordNumAPIProps): Promise<ApiResult> => {
    const result = await get(
      '/english/word/num',
      onSuccess((data: ProcessingApiReponse) => {
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
      }),
      {},
      false // 認証不要(ビルドでlocalStorage入るのを防ぐため)
    )
    return result
  }
