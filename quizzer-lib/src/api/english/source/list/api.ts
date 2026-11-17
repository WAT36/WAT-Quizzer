import type { SourceApiResponse } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get } from '../../..'

// englishbot用 出典リストをapi通信して取ってくる
export const getSourceListAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/english/source',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: SourceApiResponse[] = data.body as SourceApiResponse[]
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
