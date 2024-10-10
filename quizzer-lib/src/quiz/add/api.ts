import { AddQuizAPIRequestDto, AddQuizApiResponseDto } from './dto'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { errorMessage, MESSAGES, successMessage } from '../../..'

interface AddQuizButtonProps {
  addQuizRequestData: AddQuizAPIRequestDto
}

// 問題追加ボタンで利用するAPI
export const addQuizAPI = async ({
  addQuizRequestData
}: AddQuizButtonProps): Promise<ApiResult> => {
  if (addQuizRequestData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (!addQuizRequestData.question || !addQuizRequestData.answer) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00005) }
  }

  const result = await post(
    '/quiz',
    { ...addQuizRequestData },
    (data: ProcessingApiReponse) => {
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
          message: successMessage(MESSAGES.SUCCESS.MSG00002),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
