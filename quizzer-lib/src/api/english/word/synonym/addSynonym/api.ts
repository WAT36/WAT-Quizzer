import type { ErrorResponse, ApiResult, ProcessingApiReponse } from '../../../..'
import { post } from '../../../..'
import type { AddSynonymAPIRequestDto } from '.'

interface AddSynonymAPIProps {
  addSynonymData: AddSynonymAPIRequestDto
}

export const addSynonymAPI = async ({ addSynonymData }: AddSynonymAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/english/word/synonym',
    addSynonymData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!追加に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          }
        }
      } else {
        const errorData = data.body as ErrorResponse
        return {
          message: {
            message:
              errorData.message || 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    }
  ).catch(() => {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
