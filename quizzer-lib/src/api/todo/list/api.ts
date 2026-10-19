import type { ApiResult, ProcessingApiReponse } from '../..'
import { get } from '../..'
import type { GetTodoListApiResponseDto } from './dto'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface GetTodoListAPIProps {
  getTodoListRequestData?: Record<string, never>
}

export const getTodoListAPI = async ({}: GetTodoListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/todo',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetTodoListApiResponseDto[] = data.body as GetTodoListApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00019),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}

export const getTodoListAllAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/todo/all',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetTodoListApiResponseDto[] = data.body as GetTodoListApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00019),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
