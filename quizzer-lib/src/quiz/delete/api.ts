import {
  AddQuizApiResponseDto,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../..'
import { ApiResult, del, ProcessingApiReponse } from '../../api'
import { DeleteQuizAPIRequestDto } from './dto'

interface DeleteQuizAPIProps {
  deleteQuizAPIRequestData: DeleteQuizAPIRequestDto
}
export const deleteQuiz = async ({
  deleteQuizAPIRequestData
}: DeleteQuizAPIProps): Promise<ApiResult> => {
  if (
    !deleteQuizAPIRequestData.file_num ||
    !deleteQuizAPIRequestData.quiz_num ||
    deleteQuizAPIRequestData.file_num === -1 ||
    deleteQuizAPIRequestData.quiz_num === -1
  ) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00009) }
  }

  const result = await del(
    '/quiz',
    {
      ...deleteQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: AddQuizApiResponseDto = data.body as AddQuizApiResponseDto
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00009,
            String(deleteQuizAPIRequestData.file_num),
            String(deleteQuizAPIRequestData.quiz_num)
          ),
          result
        }
      } else if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
