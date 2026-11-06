import type { ApiResult } from '../../..'
import { post, onSuccess } from '../../..'
import type { SubmitExampleTestDataAPIRequestDto } from '.'

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
      isSuccess: false,
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
    onSuccess(() => {
      return {
        message: {
          message: `${selectedValue ? '正解+1!' : '不正解+1..'} 登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  ).catch(() => {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
