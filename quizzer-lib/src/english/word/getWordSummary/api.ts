import { WordSummaryApiResponse } from '.'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

// englishbot用 単語熟語統計データを取ってくる
export const getWordSummaryDataAPI = async (): Promise<ApiResult> => {
  const storageKey = 'wordSummaryData'
  const savedSummaryData = sessionStorage.getItem(storageKey)
  if (!savedSummaryData) {
    const result = get(
      '/english/word/summary',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: WordSummaryApiResponse[] =
            data.body as WordSummaryApiResponse[]
          // setWordSummary(result)
          // session storageに保存
          sessionStorage.setItem(storageKey, JSON.stringify(result))

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
      result: JSON.parse(savedSummaryData) as WordSummaryApiResponse[]
    }
  }
}
