import { AddSynonymGroupAPIRequestDto } from '.'
import { ProcessingApiReponse, post } from '../../../../api'

interface AddSynonymGroupAPIProps {
  addSynonymGroupData: AddSynonymGroupAPIRequestDto
}

export const addSynonymGroupAPI = async ({
  addSynonymGroupData
}: AddSynonymGroupAPIProps) => {
  if (
    !addSynonymGroupData.synonymGroupName ||
    addSynonymGroupData.synonymGroupName === ''
  ) {
    return {
      message: {
        message: 'エラー:類義語グループ名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/english/word/synonym/group',
    addSynonymGroupData,
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
