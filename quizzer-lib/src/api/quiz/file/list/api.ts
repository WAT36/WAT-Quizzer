import type { GetQuizFileApiResponseDto } from '.'
import { defaultMessage, MESSAGES } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess, readSessionCache } from '../../..'
import { quizFileListCacheSchema } from './schema'

// quizzer各画面用 問題ファイルリストをapi通信して取ってくる
export const getQuizFileListAPI = async (): Promise<ApiResult> => {
  const storageKey = 'fileName'
  const savedFileList = readSessionCache(storageKey, quizFileListCacheSchema)
  if (!savedFileList) {
    const result = get(
      '/quiz/file',
      onSuccess((data: ProcessingApiReponse) => {
        const result: GetQuizFileApiResponseDto[] =
          data.body as GetQuizFileApiResponseDto[]
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
      result: savedFileList as GetQuizFileApiResponseDto[]
    }
  }
}
