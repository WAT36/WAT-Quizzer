import type { ApiResult, ProcessingApiReponse } from '../..'
import { get, onSuccess } from '../..'
import type { GetTodoListApiResponseDto } from './dto'
import { MESSAGES, successMessage } from '../../../..'

interface GetTodoListAPIProps {
  getTodoListRequestData?: Record<string, never>
}

export const getTodoListAPI = async ({}: GetTodoListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/todo',
    onSuccess((data: ProcessingApiReponse) => {
      const result: GetTodoListApiResponseDto[] = data.body as GetTodoListApiResponseDto[]
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00019),
        result
      }
    })
  )
  return result
}

export const getTodoListAllAPI = async (): Promise<ApiResult> => {
  const result = await get(
    '/todo/all',
    onSuccess((data: ProcessingApiReponse) => {
      const result: GetTodoListApiResponseDto[] = data.body as GetTodoListApiResponseDto[]
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00019),
        result
      }
    })
  )
  return result
}
