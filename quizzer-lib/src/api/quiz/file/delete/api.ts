import type { AddQuizApiResponseDto } from '../../../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { clearQuizFileListCache } from '../list'
import { del, onSuccess, validateRequest } from '../../..'
import { deleteQuizFileApiRequestSchema } from './schema'
import type { DeleteQuizFileApiRequest } from './dto'

interface DeleteQuizFileAPIProps {
  deleteQuizFileApiRequest: DeleteQuizFileApiRequest
}

export const deleteQuizFileAPI = async ({
  deleteQuizFileApiRequest
}: DeleteQuizFileAPIProps): Promise<ApiResult> => {
  // ファイル未選択(-1)なら送らない
  const invalid = validateRequest(
    deleteQuizFileApiRequestSchema,
    deleteQuizFileApiRequest,
    () => MESSAGES.ERROR.MSG00001
  )
  if (invalid) return invalid

  const result = await del(
    '/quiz/file',
    {
      ...deleteQuizFileApiRequest
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      clearQuizFileListCache()
      return {
        message: successMessage(
          MESSAGES.SUCCESS.MSG00013,
          String(deleteQuizFileApiRequest.file_id)
        ),
        result
      }
    })
  )
  return result
}
