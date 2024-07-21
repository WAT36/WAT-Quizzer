import { ApiResult, post, ProcessingApiReponse } from '../../../api'
import { AddExampleAPIRequestDto } from '.'

// 例文データ登録
interface SubmitExampleSentenseAPIProps {
  addExampleData: AddExampleAPIRequestDto
}

export const submitExampleSentenseAPI = async ({
  addExampleData
}: SubmitExampleSentenseAPIProps): Promise<ApiResult> => {
  // TODO ここに限らずだが ブログでPromise学んだんだから api系の関数の処理見直したい
  const result = await post(
    '/english/example',
    addExampleData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: '例文を登録しました',
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
