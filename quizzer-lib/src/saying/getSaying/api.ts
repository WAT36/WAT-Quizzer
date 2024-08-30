import { get, ProcessingApiReponse } from '../../api'
import { GetRandomSayingResponse } from '.'

// TODO APIではbook_idを引数に設定できるので　その場合でもできるようにしておきたい
interface GetSayingAPIProps {}

export const getSayingAPI = async ({}: GetSayingAPIProps) => {
  const result = await get(
    '/saying',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetRandomSayingResponse[] =
          data.body as GetRandomSayingResponse[]
        return {
          message: {
            message: 'Success!!取得しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result: result[0]
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
