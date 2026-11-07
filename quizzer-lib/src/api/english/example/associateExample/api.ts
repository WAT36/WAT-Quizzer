import type { ChangeExampleAssociationAPIRequestDto } from '.'
import type { ApiResult } from '../../..'
import { post, onSuccess } from '../../..'

// 単語と例文の紐付けを変更する(isAssociation:true->紐付け false->解除)
interface ChangeExampleAssociationAPIProps {
  changeExampleAssociationData: ChangeExampleAssociationAPIRequestDto
}

export const changeExampleAssociationAPI = async ({
  changeExampleAssociationData
}: ChangeExampleAssociationAPIProps): Promise<ApiResult> => {
  const { wordName, exampleIdList, isAssociation } =
    changeExampleAssociationData
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
  if (!exampleIdList || exampleIdList.length === 0) {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:チェックしたIDリストがありません',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  // 選択した例文はまとめて1回で送り、バックエンドで一括更新する
  const result = await post(
    '/english/example/association',
    { wordName, exampleIdList, isAssociation },
    onSuccess(() => {
      return {
        message: {
          message: isAssociation
            ? '例文を紐付けました'
            : '例文の紐付けを解除しました',
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  )
  return result
}
