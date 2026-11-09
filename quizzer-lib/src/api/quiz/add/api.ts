import type { AddQuizAPIRequestDto, AddQuizApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess } from '../..'
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
  if (addQuizRequestData.file_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (!addQuizRequestData.question || !addQuizRequestData.answer) {
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
