import { GetQuizAPIRequestDto, GetQuizApiResponseDto } from '.'
import { ProcessingApiSingleReponse } from '../../..'
import { ApiResult, get } from '../../api'

interface GetQuizAPIProps {
  getQuizRequestData: GetQuizAPIRequestDto
  getQuizType?: 'random'
}

export const getQuizAPI = async ({
  getQuizRequestData,
  getQuizType
}: GetQuizAPIProps): Promise<ApiResult> => {
  if (getQuizRequestData.fileNum === '') {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (
    !getQuizType &&
    (!getQuizRequestData.quizNum || getQuizRequestData.quizNum === '')
  ) {
    return {
      message: {
        message: 'エラー:問題番号を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await get(
    '/quiz',
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 404) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
        }
      } else if (data.status === 200) {
        const result: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto
        return {
          message: {
            message: '問題を取得しました',
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
    },
    { ...getQuizRequestData }
  )
  return result
}
