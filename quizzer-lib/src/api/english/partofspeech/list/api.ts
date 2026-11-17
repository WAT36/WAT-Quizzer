import type { PartofSpeechApiResponse } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'

// englishbot用 品詞リストをapi通信して取ってくる
export const getPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/english/partsofspeech',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: PartofSpeechApiResponse[] =
          data.body as PartofSpeechApiResponse[]
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
            isDisplay: false
          }
        }
      }
    }
  )
  return result
}
