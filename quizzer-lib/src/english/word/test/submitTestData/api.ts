import { ApiResult, post, ProcessingApiReponse } from '../../../../api'
import { SubmitEnglishWordTestDataAPIRequestDto } from '.'

interface SubmitEnglishBotTestButtonProps {
  testResult: SubmitEnglishWordTestDataAPIRequestDto
  selectedValue: boolean | undefined
}

export const submitEnglishBotTestAPI = async ({
  testResult,
  selectedValue
}: SubmitEnglishBotTestButtonProps): Promise<ApiResult> => {
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
    selectedValue ? '/english/word/test/clear' : '/english/word/test/fail',
    {
      ...testResult
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        //setDisplayWordTestState({})
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
  ).catch((err) => {
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
