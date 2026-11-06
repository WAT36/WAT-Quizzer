import { defaultMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type { GetQuizFormatApiResponseDto } from './dto'

// quizzer各画面用 問題形式リストをapi通信して取ってくる
export const getQuizFormatListAPI = async (): Promise<ApiResult> => {
  const storageKey = 'quizFormatList'
  const savedFormatList = sessionStorage.getItem(storageKey)
  if (!savedFormatList) {
    const result = get(
      '/quiz/format',
      onSuccess((data: ProcessingApiReponse) => {
        const result: GetQuizFormatApiResponseDto[] =
          data.body as GetQuizFormatApiResponseDto[]
        // session storageに保存
        sessionStorage.setItem(storageKey, JSON.stringify(result))
        return {
          message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
          result
        }
      }),
      {}
    )
    return result
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    return {
      isSuccess: true,
      message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
      result: JSON.parse(savedFormatList) as GetQuizFormatApiResponseDto[]
    }
  }
}
