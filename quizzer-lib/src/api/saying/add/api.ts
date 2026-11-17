import type { AddSayingAPIRequestDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess, toErrorMessage, validateRequest } from '../..'
import { addSayingAPIRequestSchema } from './schema'
import type { AddQuizApiResponseDto } from '../../../..'
import { MESSAGES, successMessage } from '../../../..'

interface AddSayingButtonProps {
  addSayingAPIRequest: AddSayingAPIRequestDto
}

export const addSayingAPI = async ({
  addSayingAPIRequest
}: AddSayingButtonProps): Promise<ApiResult> => {
  // 本の未選択(-1)は、画面向けのメッセージにする
  const invalid = validateRequest(
    addSayingAPIRequestSchema,
    addSayingAPIRequest,
    (issue) =>
      issue.path[0] === 'book_id'
        ? MESSAGES.ERROR.MSG00011
        : toErrorMessage(issue)
  )
  if (invalid) return invalid

  const result = await post(
    '/saying',
    {
      ...addSayingAPIRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00016,
          addSayingAPIRequest.saying
        ),
        result
      }
    })
  )
  return result
}
