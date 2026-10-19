import type { ApiResult, ProcessingApiReponse } from '../../..'
import { fileUploadAPI } from '../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { UploadImageOfQuizAPIRequestDto } from './dto'

interface UploadImageOfQuizButtonProps {
  uploadQuizRequestData: UploadImageOfQuizAPIRequestDto
}

export const uploadImageOfQuizAPI = async ({
  uploadQuizRequestData
}: UploadImageOfQuizButtonProps): Promise<ApiResult> => {
  const result = await fileUploadAPI(
    '/quiz/image/upload',
    uploadQuizRequestData.file,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result = data.body
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00002),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
