import type { ChangeExampleAssociationAPIRequestDto } from '.'
import type { ApiResult } from '../../..'
import { post, onSuccess, validateRequest } from '../../..'
import { changeExampleAssociationAPIRequestSchema } from './schema'

// 単語と例文の紐付けを変更する(isAssociation:true->紐付け false->解除)
interface ChangeExampleAssociationAPIProps {
  changeExampleAssociationData: ChangeExampleAssociationAPIRequestDto
}

export const changeExampleAssociationAPI = async ({
  changeExampleAssociationData
}: ChangeExampleAssociationAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(
    changeExampleAssociationAPIRequestSchema,
    changeExampleAssociationData
  )
  if (invalid) return invalid
  const { wordName, exampleIdList, isAssociation } =
    changeExampleAssociationData

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
