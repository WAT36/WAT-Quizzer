import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, onSuccess, validateRequest } from '../../..'
import type {
  ImportImageOfQuizAPIRequestDto,
  ImportImageOfQuizAPIResponseDto
} from './dto'
import { importImageOfQuizAPIRequestSchema } from './schema'
import { MESSAGES, successMessage } from '../../../../..'

interface ImportImageOfQuizAPIProps {
  importImageRequestData: ImportImageOfQuizAPIRequestDto
}

// 選んだ候補の画像を保存し、問題に紐付ける
export const importImageOfQuizAPI = async ({
  importImageRequestData
}: ImportImageOfQuizAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    importImageOfQuizAPIRequestSchema,
    importImageRequestData,
    (issue) =>
      issue.path[0] === 'quiz_id'
        ? MESSAGES.ERROR.MSG00008
        : `エラー:${issue.message}`
  )
  if (invalid) return invalid

  return await post(
    '/quiz/image/import',
    importImageRequestData,
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as ImportImageOfQuizAPIResponseDto
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00027, result.fileName),
        result
      }
    })
  )
}
