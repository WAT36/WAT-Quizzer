import { EditQuizAPIRequestDto, EditQuizApiResponseDto } from './dto'
import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { errorMessage, MESSAGES, successMessage } from '../../..'

interface EditQuizAPIProps {
  editQuizRequestData: EditQuizAPIRequestDto
}

export const editQuizAPI = async ({
  editQuizRequestData
}: EditQuizAPIProps): Promise<ApiResult> => {
  if (editQuizRequestData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (!editQuizRequestData.question || !editQuizRequestData.answer) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00005) }
  }

  const result = await post(
    '/quiz/edit',
    {
      ...editQuizRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const result: EditQuizApiResponseDto =
          data.body as EditQuizApiResponseDto

        //入力データをクリア
        const inputQuizField = document
          .getElementsByTagName('textarea')
          .item(0) as HTMLTextAreaElement
        if (inputQuizField) {
          inputQuizField.value = ''
        }

        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00010),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
