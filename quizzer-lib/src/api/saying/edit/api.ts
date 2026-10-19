import type { EditSayingAPIRequestDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { patch } from '../..'
import type { AddQuizApiResponseDto } from '../../../..'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface editSayingAPIProps {
  editSayingRequestData: EditSayingAPIRequestDto
}

export const editSayingAPI = async ({
  editSayingRequestData
}: editSayingAPIProps): Promise<ApiResult> => {
  const result = await patch(
    '/saying',
    {
      ...editSayingRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00018),
          result
        }
      } else if (data.status === 404 || !data.body) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
