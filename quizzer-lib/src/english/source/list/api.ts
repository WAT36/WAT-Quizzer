import { SourceApiResponse } from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

// englishbot用 出典リストをapi通信して取ってくる
export const getSourceListAPI = async (): Promise<ApiResult> => {
  const storageKey = 'sourceList'
  const savedFileList = sessionStorage.getItem(storageKey)
  if (!savedFileList) {
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
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    return {
      message: {
        message: '　',
        messageColor: 'common.black',
        isDisplay: false
      },
      result: JSON.parse(savedFileList) as SourceApiResponse[]
    }
  }
}
