import type { ApiResult, ProcessingApiReponse } from '../..'
import { del } from '../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

export const cleanupEmptyCategoriesAPI = async (): Promise<ApiResult> => {
  const result = await del(
    '/category/cleanup',
    {},
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2') {
        const body = data.body as { deleted_count: number }
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004),
          result: body
        }
      } else {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00004)
        }
      }
    }
  )
  return result
}
