import type { ApiResult } from '../../..'
import { post, onSuccess, toErrorMessage, validateRequest } from '../../..'
import { addWordAPIRequestSchema } from './schema'
import type { AddWordAPIRequestDto } from './dto'

interface AddWordAPIProps {
  addWordData: AddWordAPIRequestDto
}

// 登録ボタン押下後。単語と意味をDBに登録
export const addWordAPI = async ({
  addWordData
}: AddWordAPIProps): Promise<ApiResult> => {
  // 意味の行のエラーは「N行目の〜」と表示する
  const invalid = validateRequest(
    addWordAPIRequestSchema,
    addWordData,
    (issue) =>
      issue.path[0] === 'meanArrayData' && typeof issue.path[1] === 'number'
        ? `エラー:${issue.path[1] + 1}行目の${issue.message}`
        : toErrorMessage(issue)
  )
  if (invalid) return invalid

  const result = await post(
    '/english/word',
    addWordData,
    onSuccess(() => {
      return {
        message: {
          message: `単語「${addWordData.inputWord.wordName}」を登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  ).catch((err: Error) => {
    return {
      isSuccess: false,
      message: {
        message: err.message,
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
