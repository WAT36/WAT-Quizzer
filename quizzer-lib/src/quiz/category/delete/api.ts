import { AddAPIResponseDto, ProcessingAddApiReponse } from '../../../..'
import { ApiResult, put } from '../../../api'
import { AddCategoryToQuizAPIRequestDto } from '../add/dto'

interface DeleteCategoryOfQuizAPIProps {
  // TODO プロパティ同じだからAddCategoryToQuizAPIRequestDto流用してるが、、deleteで使うのは変なので名前変えたい
  deleteCategoryToQuizRequestData: AddCategoryToQuizAPIRequestDto
}

export const deleteCategoryOfQuizAPI = async ({
  deleteCategoryToQuizRequestData
}: DeleteCategoryOfQuizAPIProps): Promise<ApiResult> => {
  if (deleteCategoryToQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await put(
    '/quiz/category',
    {
      ...deleteCategoryToQuizRequestData
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
