import { ApiResult, get, ProcessingApiReponse } from '../../api'
import { GetSayingRequest, GetSayingResponse } from '.'

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
      message: {
        message: `エラー:入力したIDが不正です:${getSayingRequestData.id}`,
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const path =
    getSayingRequestData.id && !isNaN(getSayingRequestData.id)
      ? `/saying/${getSayingRequestData.id}`
      : '/saying'
  const result = await get(
    path,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetSayingResponse = data.body as GetSayingResponse
        return {
          message: {
            message: 'Success!!取得しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    },
    {}
  )
  return result
}
