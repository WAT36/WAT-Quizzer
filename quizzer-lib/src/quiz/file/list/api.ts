import { GetQuizFileApiResponseDto } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../../..'
import { get, ApiResult, ProcessingApiReponse } from '../../../api'

// quizzer各画面用 問題ファイルリストをapi通信して取ってくる
export const getQuizFileListAPI = async (): Promise<ApiResult> => {
  const storageKey = 'fileName'
  const savedFileList = sessionStorage.getItem(storageKey)
  if (!savedFileList) {
    const result = get(
      '/quiz/file',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: GetQuizFileApiResponseDto[] =
            data.body as GetQuizFileApiResponseDto[]
          // session storageに保存
          sessionStorage.setItem(storageKey, JSON.stringify(result))
          return {
            message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
            result
          }
        } else {
          return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
        }
      },
      {}
    )
    return result
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    return {
      message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
      result: JSON.parse(savedFileList) as GetQuizFileApiResponseDto[]
    }
  }
}
