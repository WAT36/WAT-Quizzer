import type { EditQuizAPIRequestDto, EditQuizApiResponseDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { post, onSuccess } from '../..'
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
  if (editQuizRequestData.file_num === -1) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (!editQuizRequestData.question || !editQuizRequestData.answer) {
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
