import { AddAPIResponseDto, ProcessingAddApiReponse } from '../../../..'
import { AddCategoryToQuizAPIRequestDto } from './dto'
import { ApiResult, post } from '../../../api'

interface AddCategoryToQuizAPIProps {
  addCategoryToQuizRequestData: AddCategoryToQuizAPIRequestDto
}

export const addCategoryToQuizAPI = async ({
  addCategoryToQuizRequestData
}: AddCategoryToQuizAPIProps): Promise<ApiResult> => {
  if (addCategoryToQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/quiz/category',
    {
      ...addCategoryToQuizRequestData
    },
    (data: ProcessingAddApiReponse) => {
      if (String(data.status)[0] === '2' || String(data.status)[0] === '3') {
        const result: AddAPIResponseDto = data.body as AddAPIResponseDto
        return {
          message: {
            message: 'Success!! 全て更新しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (data.status === 404) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
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
  )
  return result
}
