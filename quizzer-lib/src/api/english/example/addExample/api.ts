import type { ApiResult } from '../../..'
import { post, onSuccess, validateRequest } from '../../..'
import { addExampleAPIRequestSchema } from './schema'
import type { AddExampleAPIRequestDto } from '.'

// 例文データ登録
interface SubmitExampleSentenseAPIProps {
  addExampleData: AddExampleAPIRequestDto
}

export const submitExampleSentenseAPI = async ({
  addExampleData
}: SubmitExampleSentenseAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(addExampleAPIRequestSchema, addExampleData)
  if (invalid) return invalid

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
