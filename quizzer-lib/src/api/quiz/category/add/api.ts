import type { AddCategoryToQuizAPIRequestDto } from './dto'
import type { QuizWithCategoryApiResponseDto } from '../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, toErrorMessage, validateRequest } from '../../..'
import { addCategoryToQuizAPIRequestSchema } from './schema'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'

interface AddCategoryToQuizAPIProps {
  addCategoryToQuizRequestData: AddCategoryToQuizAPIRequestDto
}

export const addCategoryToQuizAPI = async ({
  addCategoryToQuizRequestData
}: AddCategoryToQuizAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    addCategoryToQuizAPIRequestSchema,
    addCategoryToQuizRequestData,
    (issue) =>
      issue.path[0] === 'quiz_ids'
        ? MESSAGES.ERROR.MSG00001
        : toErrorMessage(issue)
  )
  if (invalid) return invalid

  const result = await post(
    '/quiz/category',
    {
      ...addCategoryToQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        const result = data.body as QuizWithCategoryApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004),
          result
        }
      } else if (data.status === 404) {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00003)
        }
      } else {
        return {
          message: errorMessage(MESSAGES.ERROR.MSG00004)
        }
      }
    }
  )
  return result
}
