import { defaultMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type { GetSelfHelpBookResponse } from './dto'

// 設定ページ用 啓発本名リストをapi通信して取ってくる
export const listBook = async (): Promise<ApiResult> => {
  const result = await get('/saying/book', onSuccess((data: ProcessingApiReponse) => {
    const result: GetSelfHelpBookResponse[] =
      data.body as GetSelfHelpBookResponse[]
    return {
      message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
      result
    }
                                           }))
  return result
}
