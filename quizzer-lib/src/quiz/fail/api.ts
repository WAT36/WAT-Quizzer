import { GetQuizApiResponseDto } from '../get'
import { ApiResult, post } from '../../api'
import { ProcessingApiSingleReponse } from '../../..'

interface FailQuizButtonProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const failQuizAPI = async ({
  getQuizResponseData
}: FailQuizButtonProps): Promise<ApiResult> => {
  if (getQuizResponseData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (getQuizResponseData.quiz_num === -1) {
    return {
      message: {
        message: 'エラー:問題番号がありません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (
    !getQuizResponseData.quiz_sentense ||
    !getQuizResponseData.answer
  ) {
    return {
      message: {
        message: 'エラー:問題を出題してから登録して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/quiz/fail',
    {
      format: getQuizResponseData.format,
      fileNum: getQuizResponseData.file_num,
      quizNum: getQuizResponseData.quiz_num
    },
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: `問題[${getQuizResponseData.quiz_num}] 不正解+1.. 登録しました`,
            messageColor: 'success.light',
            isDisplay: true
          }
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
    }
  )
  return result
}
