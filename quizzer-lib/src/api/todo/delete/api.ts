import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { del } from '../..'
import type { DeleteTodoAPIRequestDto, DeleteTodoApiResponseDto } from './dto'

interface DeleteTodoAPIProps {
  deleteTodoAPIRequestData: DeleteTodoAPIRequestDto
}

export const deleteTodoAPI = async ({
  deleteTodoAPIRequestData
}: DeleteTodoAPIProps): Promise<ApiResult> => {
  if (
    !deleteTodoAPIRequestData.id ||
    deleteTodoAPIRequestData.id === -1
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00009) }
  }

  const result = await del(
    `/todo/${deleteTodoAPIRequestData.id}`,
    {},
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: DeleteTodoApiResponseDto = data.body as DeleteTodoApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00009),
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
