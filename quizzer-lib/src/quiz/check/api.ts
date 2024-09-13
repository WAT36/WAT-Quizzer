import { GetQuizApiResponseDto } from '..'
import { ApiResult, post } from '../../api'
import { ProcessingApiSingleReponse } from '../../..'

interface ReverseCheckQuizButtonProps {
  getQuizResponseData: GetQuizApiResponseDto
}

export const checkQuizAPI = async ({
  getQuizResponseData
}: ReverseCheckQuizButtonProps): Promise<ApiResult> => {
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
    '/quiz/check',
    {
      format: getQuizResponseData.format,
      file_num: getQuizResponseData.file_num,
      quiz_num: getQuizResponseData.quiz_num
    },
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto
        return {
          message: {
            message: `問題[${getQuizResponseData.quiz_num}] にチェック${
              result.checked ? 'をつけ' : 'を外し'
            }ました`,
            messageColor: 'success.light',
            isDisplay: true
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
    }
  )
  return result
}
