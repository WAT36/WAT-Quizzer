import type { AddQuizAPIRequestDto, AddQuizApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess, toErrorMessage, validateRequest } from '../..'
import { addQuizAPIRequestSchema } from './schema'
import {
  containsAny,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'

interface AddQuizAPIProps {
  addQuizRequestData: AddQuizAPIRequestDto
}

// 問題追加ボタンで利用するAPI
export const addQuizAPI = async ({
  addQuizRequestData
}: AddQuizAPIProps): Promise<ApiResult> => {
  // ファイル未選択(-1)は、画面向けのメッセージにする
  const invalid = validateRequest(
    addQuizAPIRequestSchema,
    addQuizRequestData,
    (issue) =>
      issue.path[0] === 'file_num'
        ? MESSAGES.ERROR.MSG00001
        : toErrorMessage(issue)
  )
  if (invalid) return invalid
  // 問題文・答えはスキーマでは任意項目（入力途中の状態も持つため）なので、ここで確認する
  if (!addQuizRequestData.question || !addQuizRequestData.answer) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00005) }
  }

  // 問題文・答えとダミー選択肢にカンマとハイフンが入っていたらエラー終了
  const ngChar = [',', '-']
  if (
    containsAny(addQuizRequestData.question, ngChar) ||
    containsAny(addQuizRequestData.answer, ngChar) ||
    addQuizRequestData.dummyChoice?.reduce((accummulate, currentValue) => {
      return accummulate || containsAny(currentValue.sentense, ngChar)
    }, false)
  ) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00015) }
  }

  const result = await post(
    '/quiz',
    { ...addQuizRequestData },
    onSuccess((data: ProcessingApiReponse) => {
      const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
      result.log = `Added!! [${result.file_num}-${result.quiz_num}]:${result.quiz_sentense},${result.answer}`

      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00002),
        result
      }
    })
  )
  return result
}
