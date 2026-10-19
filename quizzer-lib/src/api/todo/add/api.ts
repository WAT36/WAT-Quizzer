import type { AddTodoAPIRequestDto, AddTodoApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post } from '../..'
import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'

interface AddTodoAPIProps {
  addTodoAPIRequest: AddTodoAPIRequestDto
}

export const addTodoAPI = async ({
  addTodoAPIRequest
}: AddTodoAPIProps): Promise<ApiResult> => {
  if (!addTodoAPIRequest.todo || addTodoAPIRequest.todo === '') {
    return { message: errorMessage(MESSAGES.ERROR.MSG00012) }
  }

  const result = await post(
    '/todo',
    {
      ...addTodoAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddTodoApiResponseDto = data.body as AddTodoApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00025,result.todo),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
