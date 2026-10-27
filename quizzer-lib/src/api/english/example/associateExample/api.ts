import type { SubmitAssociationExampleAPIRequestDto } from '.'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { post } from '../../..'

// TODO 名前なんか違う気するので変えたい
// 例文と単語を紐付けしたり外したりだから・・何がいい？
interface SubmitAssociationExampleButtonProps {
  submitAssociationExampleData: SubmitAssociationExampleAPIRequestDto
}

export const submitAssociationExampleAPI = async ({
  submitAssociationExampleData
}: SubmitAssociationExampleButtonProps): Promise<ApiResult> => {
  const { wordName, checkedIdList, isAssociation } =
    submitAssociationExampleData
  if (!wordName) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:単語が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }
  if (!checkedIdList) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:チェックしたIDリストがありません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  // TODO 配列でのデータをAPIでどう送るのが良いか？途中で失敗した時のロールバック方法とかも考えたい
  for (const checkedId of checkedIdList) {
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
    ).catch(() => {
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
    isSuccess: true,
    message: {
      message: '処理が終了しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  }
}
