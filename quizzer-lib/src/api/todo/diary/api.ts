import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, validateRequest } from '../..'
import { addTodoDiaryAPIRequestSchema } from './schema'
import type { AddTodoDiaryAPIRequestDto, AddTodoDiaryApiResponseDto } from './dto'

interface AddTodoDiaryAPIProps {
  addTodoDiaryAPIRequest: AddTodoDiaryAPIRequestDto
}

export const addTodoDiaryAPI = async ({
  addTodoDiaryAPIRequest
}: AddTodoDiaryAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    addTodoDiaryAPIRequestSchema,
    addTodoDiaryAPIRequest
  )
  if (invalid) return invalid

  const result = await post(
    '/todo/diary',
    {
      ...addTodoDiaryAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddTodoDiaryApiResponseDto =
          data.body as AddTodoDiaryApiResponseDto
        return {
          message: successMessage(
            `Todo日記を追加しました（日付: ${result.date}）`
          ),
          result
        }
      } else if (data.status === 400) {
        // バリデーションエラー
        return {
          message: errorMessage('エラー:日付はYYYY-MM-DD形式で入力してください')
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
