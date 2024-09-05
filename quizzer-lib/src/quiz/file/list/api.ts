import { GetQuizFileApiResponseDto } from '.'
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
            message: {
              message: '　',
              messageColor: 'common.black',
              isDisplay: false
            },
            result
          }
        } else {
          return {
            message: {
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error',
              isDisplay: true
            }
          }
        }
      },
      {}
    )
    return result
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    return {
      message: {
        message: '　',
        messageColor: 'common.black',
        isDisplay: false
      },
      result: JSON.parse(savedFileList) as GetQuizFileApiResponseDto[]
    }
  }
}
