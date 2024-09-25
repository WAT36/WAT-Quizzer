import { AddQuizAPIRequestDto, AddQuizApiResponseDto } from './dto'
import { ApiResult, post } from '../../api'
import { ProcessingAddApiReponse } from '../../..'

interface AddQuizButtonProps {
  addQuizRequestData: AddQuizAPIRequestDto
}

// 問題追加ボタンで利用するAPI
export const addQuizAPI = async ({
  addQuizRequestData
}: AddQuizButtonProps): Promise<ApiResult> => {
  if (addQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (!addQuizRequestData.question || !addQuizRequestData.answer) {
    return {
      message: {
        message: 'エラー:問題文及び答えを入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  // 問題形式によりAPI決定
  let apiPath
  switch (addQuizRequestData.value) {
    case 0:
      apiPath = '/quiz'
      break
    case 1:
      apiPath = '/quiz/advanced'
      break
    case 2:
      apiPath = '/quiz/advanced/4choice'
      break
    default:
      return {
        message: {
          message: `エラー：問題形式不正:${addQuizRequestData.value}`,
          messageColor: 'error',
          isDisplay: true
        }
      }
  }

  const result = await post(
    apiPath,
    { ...addQuizRequestData },
    (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        result.log = `Added!! [${result.file_num}-${result.quiz_num}]:${result.quiz_sentense},${result.answer}`

        //入力データをクリア
        // TODO ステート操作したら画面も消えるようになんないかな
        const inputQuizField = document
          .getElementsByTagName('textarea')
          .item(0) as HTMLTextAreaElement
        if (inputQuizField) {
          inputQuizField.value = ''
        }

        return {
          message: {
            message: 'Success!! 問題を追加できました!',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
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
