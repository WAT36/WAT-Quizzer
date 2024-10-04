import { EditSayingAPIRequestDto } from './dto'
import { ApiResult, patch, ProcessingApiReponse } from '../../api'
import { AddQuizApiResponseDto } from '../../..'

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
          message: {
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (data.status === 404 || !data.body) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
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
    }
  )
  return result
}
