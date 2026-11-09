import type { ApiResult, ProcessingApiReponse } from '../../..'
import { fileUploadAPI, onSuccess } from '../../..'
import { MESSAGES, successMessage } from '../../../../..'
import type {
  UploadImageOfQuizAPIRequestDto,
  UploadImageOfQuizAPIResponseDto
} from './dto'

interface UploadImageOfQuizButtonProps {
  uploadQuizRequestData: UploadImageOfQuizAPIRequestDto
}

export const uploadImageOfQuizAPI = async ({
  uploadQuizRequestData
}: UploadImageOfQuizButtonProps): Promise<ApiResult> => {
  const result = await fileUploadAPI(
    '/quiz/image/upload',
    uploadQuizRequestData.file,
    onSuccess((data: ProcessingApiReponse) => {
      const result = data.body as UploadImageOfQuizAPIResponseDto
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00002),
        result
      }
    })
  )
  return result
}
