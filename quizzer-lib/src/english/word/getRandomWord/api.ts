import { GetRandomWordAPIResponse } from 'quizzer-lib'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

// englishbot用 単語ランダム取得をapi通信して取ってくる
export const getRandomWordAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/english/word/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
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
