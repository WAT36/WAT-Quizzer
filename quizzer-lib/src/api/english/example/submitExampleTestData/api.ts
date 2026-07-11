import { ApiResult, post, ProcessingApiReponse } from '../../..'
import { SubmitExampleTestDataAPIRequestDto } from '.'

interface SubmitExampleTestDataAPIProps {
  testResult: SubmitExampleTestDataAPIRequestDto
  selectedValue: boolean | undefined
}

export const submitExampleTestDataAPI = async ({
  testResult,
  selectedValue
}: SubmitExampleTestDataAPIProps): Promise<ApiResult> => {
  if (selectedValue === undefined) {
    return {
      message: {
        message: 'エラー:解答が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    selectedValue
      ? '/english/example/test/clear'
      : '/english/example/test/fail',
    {
      ...testResult
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: `${selectedValue ? '正解+1!' : '不正解+1..'} 登録しました`,
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
  ).catch(() => {
    return {
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
