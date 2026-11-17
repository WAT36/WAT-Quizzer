import type { EditQuizAPIRequestDto, EditQuizApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess, toErrorMessage, validateRequest } from '../..'
import { editQuizAPIRequestSchema } from './schema'
import {
  containsAny,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'

interface EditQuizAPIProps {
  editQuizRequestData: EditQuizAPIRequestDto
}

export const editQuizAPI = async ({
  editQuizRequestData
}: EditQuizAPIProps): Promise<ApiResult> => {
  // ファイル未選択・問題未取得(-1)は、画面向けのメッセージにする
  const invalid = validateRequest(
    editQuizAPIRequestSchema,
    editQuizRequestData,
    (issue) => {
      if (issue.path[0] === 'file_num') return MESSAGES.ERROR.MSG00001
      if (issue.path[0] === 'quiz_id' || issue.path[0] === 'quiz_num') {
        return MESSAGES.ERROR.MSG00002
      }
      return toErrorMessage(issue)
    }
  )
  if (invalid) return invalid
  // 問題文・答えはスキーマでは任意項目（入力途中の状態も持つため）なので、ここで確認する
  if (!editQuizRequestData.question || !editQuizRequestData.answer) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00005) }
  }

  // 問題文・答えとダミー選択肢にカンマとハイフンが入っていたらエラー終了
  const ngChar = [',', '-']
  if (
    containsAny(editQuizRequestData.question, ngChar) ||
    containsAny(editQuizRequestData.answer, ngChar) ||
    editQuizRequestData.dummyChoice?.reduce((accummulate, currentValue) => {
      return accummulate || containsAny(currentValue.sentense, ngChar)
    }, false)
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00015) }
  }

  const result = await post(
    '/quiz/edit',
    {
      ...editQuizRequestData
    },
    onSuccess((data: ProcessingApiReponse) => {
      const result: EditQuizApiResponseDto =
        data.body as EditQuizApiResponseDto

      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00010),
        result
      }
    })
  )
  return result
}
