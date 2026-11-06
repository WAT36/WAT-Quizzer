import type { GetRandomWordAPIResponse } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'

// englishbot用 単語ランダム取得をapi通信して取ってくる
export const getRandomWordAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/english/word/random',
    onSuccess((data: ProcessingApiReponse) => {
      const result: GetRandomWordAPIResponse =
        data.body as GetRandomWordAPIResponse
      //setRandomWord(result);
      return {
        message: {
          message: 'Success!!取得しました',
          messageColor: 'success.light',
          isDisplay: false
        },
        result
      }
    }),
    {}
  )
  return result
}
