import type { AddTodoAPIRequestDto, AddTodoApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess, validateRequest } from '../..'
import { addTodoAPIRequestSchema } from './schema'
import { MESSAGES, successMessage } from '../../../..'

interface AddTodoAPIProps {
  addTodoAPIRequest: AddTodoAPIRequestDto
}

export const addTodoAPI = async ({
  addTodoAPIRequest
}: AddTodoAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(addTodoAPIRequestSchema, addTodoAPIRequest)
  if (invalid) return invalid

  const result = await post(
    '/todo',
    {
      ...addTodoAPIRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddTodoApiResponseDto = data.body as AddTodoApiResponseDto
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00025,result.todo),
        result
      }
    })
  )
  return result
}
