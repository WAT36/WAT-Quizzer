import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { get, put } from '../..'
import type {
  GetTodoCheckStatusAPIRequestDto,
  GetTodoCheckStatusApiResponseDto,
  SaveTodoCheckStatusAPIRequestDto,
  SaveTodoCheckStatusApiResponseDto
} from './dto'

interface GetTodoCheckStatusAPIProps {
  getTodoCheckStatusAPIRequest: GetTodoCheckStatusAPIRequestDto
}

export const getTodoCheckStatusAPI = async ({
  getTodoCheckStatusAPIRequest
}: GetTodoCheckStatusAPIProps): Promise<ApiResult> => {
  // 日付形式のバリデーション（YYYY-MM-DD形式）
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (
    !getTodoCheckStatusAPIRequest.date ||
    !dateRegex.test(getTodoCheckStatusAPIRequest.date)
  ) {
    return {
      message: errorMessage('エラー:日付はYYYY-MM-DD形式で入力してください')
    }
  }

  const result = await get(
    `/todo/check-status/${getTodoCheckStatusAPIRequest.date}`,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetTodoCheckStatusApiResponseDto =
          data.body as GetTodoCheckStatusApiResponseDto
        return {
          message: successMessage('Todoチェック状態を取得しました'),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}

interface SaveTodoCheckStatusAPIProps {
  saveTodoCheckStatusAPIRequest: SaveTodoCheckStatusAPIRequestDto
}

export const saveTodoCheckStatusAPI = async ({
  saveTodoCheckStatusAPIRequest
}: SaveTodoCheckStatusAPIProps): Promise<ApiResult> => {
  // 日付形式のバリデーション（YYYY-MM-DD形式）
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (
    !saveTodoCheckStatusAPIRequest.date ||
    !dateRegex.test(saveTodoCheckStatusAPIRequest.date)
  ) {
    return {
      message: errorMessage('エラー:日付はYYYY-MM-DD形式で入力してください')
    }
  }

  const result = await put(
    '/todo/check-status',
    {
      ...saveTodoCheckStatusAPIRequest
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: SaveTodoCheckStatusApiResponseDto =
          data.body as SaveTodoCheckStatusApiResponseDto
        return {
          message: successMessage('Todoチェック状態を保存しました'),
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
