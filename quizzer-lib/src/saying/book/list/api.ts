import { defaultMessage, errorMessage, MESSAGES } from '../../../..'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'
import { GetSelfHelpBookResponse } from './dto'

// 設定ページ用 啓発本名リストをapi通信して取ってくる
export const listBook = async (): Promise<ApiResult> => {
  const result = await get('/saying/book', (data: ProcessingApiReponse) => {
    if (data.status === 200) {
      const result: GetSelfHelpBookResponse[] =
        data.body as GetSelfHelpBookResponse[]
      return {
        message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
        result
      }
    } else {
      return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
    }
  })
  return result
}
