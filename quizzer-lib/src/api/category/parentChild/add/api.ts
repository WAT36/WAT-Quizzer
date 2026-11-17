import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post, toErrorMessage, validateRequest } from '../../..'
import { addCategoryParentChildAPIRequestSchema } from '../schema'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { AddCategoryParentChildAPIRequestDto } from '../dto'

interface AddCategoryParentChildAPIProps {
  addCategoryParentChildData: AddCategoryParentChildAPIRequestDto
}

export const addCategoryParentChildAPI = async ({
  addCategoryParentChildData
}: AddCategoryParentChildAPIProps): Promise<ApiResult> => {
  // ファイル未選択(-1)は、画面向けのメッセージにする
  const invalid = validateRequest(
    addCategoryParentChildAPIRequestSchema,
    addCategoryParentChildData,
    (issue) =>
      issue.path[0] === 'file_num'
        ? MESSAGES.ERROR.MSG00001
        : toErrorMessage(issue)
  )
  if (invalid) return invalid

  const result = await post(
    '/category/parent-child',
    { ...addCategoryParentChildData },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004)
        }
      } else if (data.status === 409) {
        return {
          message: {
            message: 'エラー:既に登録されている親子関係です',
            messageColor: 'error',
            isDisplay: true
          }
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
