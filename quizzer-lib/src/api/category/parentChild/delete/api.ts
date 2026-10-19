import type { ApiResult, ProcessingApiReponse } from '../../..'
import { del } from '../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { DeleteCategoryParentChildAPIRequestDto } from '../dto'

interface DeleteCategoryParentChildAPIProps {
  deleteCategoryParentChildData: DeleteCategoryParentChildAPIRequestDto
}

export const deleteCategoryParentChildAPI = async ({
  deleteCategoryParentChildData
}: DeleteCategoryParentChildAPIProps): Promise<ApiResult> => {
  const result = await del(
    '/category/parent-child',
    { ...deleteCategoryParentChildData },
    (data: ProcessingApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00004)
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
