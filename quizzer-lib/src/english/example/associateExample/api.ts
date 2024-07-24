import { SubmitAssociationExampleAPIRequestDto } from '.'
import { post, ProcessingApiReponse } from '../../../api'

// TODO 名前なんか違う気するので変えたい
// 例文と単語を紐付けしたり外したりだから・・何がいい？
interface SubmitAssociationExampleButtonProps {
  submitAssociationExampleData: SubmitAssociationExampleAPIRequestDto
}

export const submitAssociationExampleAPI = async ({
  submitAssociationExampleData
}: SubmitAssociationExampleButtonProps) => {
  const { wordName, checkedIdList, isAssociation } =
    submitAssociationExampleData
  if (!submitAssociationExampleData.wordName) {
    return {
      message: {
        message: 'エラー:単語が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  // TODO 配列でのデータをAPIでどう送るのが良いか？途中で失敗した時のロールバック方法とかも考えたい
  for (let checkedId of checkedIdList) {
    await post(
      '/english/example/association',
      {
        wordName,
        checkedId,
        isAssociation
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          return {
            message: {
              message: `更新しました`,
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
  }
  return {
    message: {
      message: '処理が終了しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  }
}
