import type { ApiResult, ProcessingApiReponse } from '../..'
import { get, onSuccess } from '../..'
import type { GetSayingByIdRequest, GetSayingResponse } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

const toSayingResult = onSuccess((data: ProcessingApiReponse) => {
  const result: GetSayingResponse = data.body as GetSayingResponse
  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00019),
    result
  }
})

// ランダムに格言を1件取得する
export const getRandomSayingAPI = async (): Promise<ApiResult> =>
  await get('/saying', toSayingResult)

interface GetSayingByIdAPIProps {
  getSayingByIdRequestData: GetSayingByIdRequest
}

// ID指定で格言を取得する
export const getSayingByIdAPI = async ({
  getSayingByIdRequestData
}: GetSayingByIdAPIProps): Promise<ApiResult> => {
  const { id } = getSayingByIdRequestData
  if (!Number.isInteger(id) || id <= 0) {
    return {
      isSuccess: false,
      message: errorMessage(MESSAGES.ERROR.MSG00014, String(id))
    }
  }
  return await get(`/saying/${id}`, toSayingResult)
}
