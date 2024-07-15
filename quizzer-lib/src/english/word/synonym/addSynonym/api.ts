import { ErrorResponse, ProcessingApiReponse, post } from '../../../../api'
import { AddSynonymAPIRequestDto } from '.'

interface AddSynonymAPIProps {
  addSynonymData: AddSynonymAPIRequestDto
}

export const addSynonymAPI = async ({ addSynonymData }: AddSynonymAPIProps) => {
  if (!addSynonymData.wordName || addSynonymData.wordName === '') {
    return {
      message: {
        message: 'エラー:追加する単語名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/english/word/synonym',
    addSynonymData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: {
            message: 'Success!!追加に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          }
        }
      } else {
        const errorData = data.body as ErrorResponse
        return {
          message: {
            message:
              errorData.message || 'エラー:外部APIとの連携に失敗しました',
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
