import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type {
  GetImageOfQuizAPIRawResponseDto,
  GetImageOfQuizAPIRequestDto,
  GetImageOfQuizAPIResponseDto
} from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'

interface GetImageOfQuizAPIProps {
  getImageOfQuizRequestData: GetImageOfQuizAPIRequestDto
}

export const getImageOfQuizAPI = async ({
  getImageOfQuizRequestData
}: GetImageOfQuizAPIProps): Promise<ApiResult> => {
  if (!getImageOfQuizRequestData.fileName) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00020) }
  }

  return await get(
    '/quiz/image',
    onSuccess((data: ProcessingApiReponse) => {
      const { base64, mimeType } = data.body as GetImageOfQuizAPIRawResponseDto
      const result: GetImageOfQuizAPIResponseDto = {
        imageUrl: `data:${mimeType};base64,${base64}`
      }
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00021),
        result
      }
    }),
    { fileName: getImageOfQuizRequestData.fileName }
  )
}
