import { AddQuizApiResponseDto } from '../../../../'
import { post, ApiResult, ProcessingApiReponse } from '../../../api'
import { AddBookAPIRequestDto } from './dto'

interface AddBookButtonProps {
  addBookAPIRequest: AddBookAPIRequestDto
}

export const addBookAPI = async ({
  addBookAPIRequest
}: AddBookButtonProps): Promise<ApiResult> => {
  if (!addBookAPIRequest.book_name || addBookAPIRequest.book_name === '') {
    return {
      message: {
        message: 'エラー:本の名前を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/saying/book',
    {
      ...addBookAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: {
            message: `新規本「${addBookAPIRequest.book_name}」を追加しました`,
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
