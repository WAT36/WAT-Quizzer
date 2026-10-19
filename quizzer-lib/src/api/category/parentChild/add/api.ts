import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post } from '../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { AddCategoryParentChildAPIRequestDto } from '../dto'

interface AddCategoryParentChildAPIProps {
  addCategoryParentChildData: AddCategoryParentChildAPIRequestDto
}

export const addCategoryParentChildAPI = async ({
  addCategoryParentChildData
}: AddCategoryParentChildAPIProps): Promise<ApiResult> => {
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
