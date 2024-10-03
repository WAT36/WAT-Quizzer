import { get, ApiResult, ProcessingApiReponse } from '../../../api'
import { GetSelfHelpBookResponse } from './dto'

// 設定ページ用 啓発本名リストをapi通信して取ってくる
export const listBook = async (): Promise<ApiResult> => {
  const result = await get('/saying/book', (data: ProcessingApiReponse) => {
    if (data.status === 200) {
      const result: GetSelfHelpBookResponse[] =
        data.body as GetSelfHelpBookResponse[]
      return {
        message: {
          message: '　',
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
  })
  return result
}
