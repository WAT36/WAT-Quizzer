import type { ApiResult } from '../../..'
import { onSuccess, post, toErrorMessage, validateRequest } from '../../..'
import { addCategoryParentChildAPIRequestSchema } from '../schema'
import { MESSAGES, successMessage } from '../../../../..'
import type { AddCategoryParentChildAPIRequestDto } from '../dto'

interface AddCategoryParentChildAPIProps {
  addCategoryParentChildData: AddCategoryParentChildAPIRequestDto
}

export const addCategoryParentChildAPI = async ({
  addCategoryParentChildData
}: AddCategoryParentChildAPIProps): Promise<ApiResult> => {
  // ファイル未選択(-1)は、画面向けのメッセージにする
  const invalid = validateRequest(
    addCategoryParentChildAPIRequestSchema,
    addCategoryParentChildData,
    (issue) =>
      issue.path[0] === 'file_num'
        ? MESSAGES.ERROR.MSG00001
        : toErrorMessage(issue)
  )
  if (invalid) return invalid

  // 409(既に登録済み・子カテゴリに別の親カテゴリが設定済み)などは、バックエンドの理由をそのまま表示する
  const result = await post(
    '/category/parent-child',
    { ...addCategoryParentChildData },
    onSuccess(() => ({
      message: successMessage(MESSAGES.SUCCESS.MSG00004)
    }))
  )
  return result
}
