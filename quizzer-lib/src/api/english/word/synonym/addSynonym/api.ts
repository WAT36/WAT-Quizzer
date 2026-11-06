import type { ApiResult } from '../../../..'
import { post, onSuccess } from '../../../..'
import type { AddSynonymAPIRequestDto } from '.'

interface AddSynonymAPIProps {
  addSynonymData: AddSynonymAPIRequestDto
}

export const addSynonymAPI = async ({ addSynonymData }: AddSynonymAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/english/word/synonym',
    addSynonymData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!追加に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
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
