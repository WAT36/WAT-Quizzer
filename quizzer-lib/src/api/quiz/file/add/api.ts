import type { AddQuizApiResponseDto } from '../../../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { clearQuizFileListCache } from '../list'
import { post, onSuccess, validateRequest } from '../../..'
import { addQuizFileApiRequestSchema } from './schema'
import type { AddQuizFileApiRequest } from './dto'

interface AddQuizFileAPIProps {
  addQuizFileApiRequest: AddQuizFileApiRequest
}

export const addQuizFileAPI = async ({
  addQuizFileApiRequest
}: AddQuizFileAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    addQuizFileApiRequestSchema,
    addQuizFileApiRequest
  )
  if (invalid) return invalid

  const result = await post(
    '/quiz/file',
    {
      ...addQuizFileApiRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      clearQuizFileListCache()
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00012,
          String(addQuizFileApiRequest.file_nickname)
        ),
        result
      }
    })
  )
  return result
}
