import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { put } from '../..'
import type { RestoreTodoAPIRequestDto, RestoreTodoApiResponseDto } from './dto'

interface RestoreTodoAPIProps {
  restoreTodoAPIRequestData: RestoreTodoAPIRequestDto
}

export const restoreTodoAPI = async ({
  restoreTodoAPIRequestData
}: RestoreTodoAPIProps): Promise<ApiResult> => {
  if (
    !restoreTodoAPIRequestData.id ||
    restoreTodoAPIRequestData.id === -1
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00009) }
  }

  const result = await put(
    `/todo/${restoreTodoAPIRequestData.id}/restore`,
    {},
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: RestoreTodoApiResponseDto = data.body as RestoreTodoApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00018),
          result
        }
      } else if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
