import type { ApiResult } from '../../..'
import { post, onSuccess } from '../../..'
import type { AddExampleAPIRequestDto } from '.'

// 例文データ登録
interface SubmitExampleSentenseAPIProps {
  addExampleData: AddExampleAPIRequestDto
}

export const submitExampleSentenseAPI = async ({
  addExampleData
}: SubmitExampleSentenseAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/english/example',
    addExampleData,
    onSuccess(() => {
      return {
        message: {
          message: '例文を登録しました',
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  )
  return result
}
