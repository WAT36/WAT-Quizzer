import { ApiResult, get, ProcessingApiReponse } from '../../api'
import { GetSayingRequest, GetSayingResponse } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../..'

// TODO APIではbook_idを引数に設定できるので　その場合でもできるようにしておきたい
interface GetSayingAPIProps {
  getSayingRequestData: GetSayingRequest
}

export const getSayingAPI = async ({
  getSayingRequestData
}: GetSayingAPIProps): Promise<ApiResult> => {
  if (
    getSayingRequestData.id &&
    (isNaN(getSayingRequestData.id) || getSayingRequestData.id === -1)
  ) {
    return {
      message: errorMessage(
        MESSAGES.ERROR.MSG00014,
        String(getSayingRequestData.id)
      )
    }
  }

  const path =
    getSayingRequestData.id && !isNaN(getSayingRequestData.id)
      ? `/saying/${getSayingRequestData.id}`
      : '/saying'
  const result = await get(path, (data: ProcessingApiReponse) => {
    if (data.status === 200) {
      const result: GetSayingResponse = data.body as GetSayingResponse
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00019),
        result
      }
    } else {
      return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
    }
  })
  return result
}
