import { CheckQuizAPIRequestDto } from '../..'
import {
  AddAPIResponseDto,
  ApiResult,
  ProcessingApiReponse,
  put
} from '../../../api'

interface CheckOnQuizButtonProps {
  checkQuizRequestData: CheckQuizAPIRequestDto
}

export const checkOnQuizAPI = async ({
  checkQuizRequestData
}: CheckOnQuizButtonProps): Promise<ApiResult> => {
  if (checkQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (checkQuizRequestData.quiz_num === '') {
    return {
      message: {
        message: 'エラー:問題番号がありません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await put(
    '/quiz/check',
    {
      ...checkQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddAPIResponseDto = data.body as AddAPIResponseDto
        return {
          message: {
            message: 'Success!! 全て更新しました(再検索してください)',
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
