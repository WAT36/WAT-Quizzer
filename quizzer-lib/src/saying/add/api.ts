import { AddSayingAPIRequestDto } from './dto'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { AddQuizApiResponseDto } from '../../..'

interface AddSayingButtonProps {
  addSayingAPIRequest: AddSayingAPIRequestDto
}

export const addSayingAPI = async ({
  addSayingAPIRequest
}: AddSayingButtonProps): Promise<ApiResult> => {
  if (!addSayingAPIRequest.book_id || addSayingAPIRequest.book_id === -1) {
    return {
      message: {
        message: 'エラー:本名を選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (!addSayingAPIRequest.saying || addSayingAPIRequest.saying === '') {
    return {
      message: {
        message: 'エラー:格言を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/saying',
    {
      ...addSayingAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message: `新規格言「${addSayingAPIRequest.saying}」を追加しました`,
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
    }
  )
  return result
}
