import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess, validateRequest } from '../../..'
import type {
  SearchImageCandidatesOfQuizAPIRequestDto,
  SearchImageCandidatesOfQuizAPIResponseDto
} from './dto'
import { searchImageCandidatesOfQuizAPIRequestSchema } from './schema'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'

interface SearchImageCandidatesOfQuizAPIProps {
  searchImageCandidatesRequestData: SearchImageCandidatesOfQuizAPIRequestDto
}

// 問題文と答えから、参考画像の候補をWebで探す
export const searchImageCandidatesOfQuizAPI = async ({
  searchImageCandidatesRequestData
}: SearchImageCandidatesOfQuizAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    searchImageCandidatesOfQuizAPIRequestSchema,
    searchImageCandidatesRequestData,
    (issue) =>
      issue.path[0] === 'quiz_id'
        ? MESSAGES.ERROR.MSG00008
        : `エラー:${issue.message}`
  )
  if (invalid) return invalid

  const { quiz_id, hint } = searchImageCandidatesRequestData
  return await get(
    '/quiz/image/candidates',
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as SearchImageCandidatesOfQuizAPIResponseDto
      return {
        message:
          result.candidates.length > 0
            ? successMessage(
                MESSAGES.SUCCESS.MSG00026,
                String(result.candidates.length)
              )
            : errorMessage(MESSAGES.ERROR.MSG00021),
        result
      }
    }),
    { quiz_id, ...(hint?.trim() ? { hint: hint.trim() } : {}) }
  )
}
