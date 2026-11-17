import { errorMessage, MESSAGES, successMessage } from '../../../..'
import type { ApiResult, ProcessingApiReponse, QuizApiResponseDto } from '../..'
import { del, validateRequest } from '../..'
import { deleteQuizAPIRequestSchema } from './schema'
import type { DeleteQuizAPIRequestDto } from './dto'

interface DeleteQuizAPIProps {
  deleteQuizAPIRequestData: DeleteQuizAPIRequestDto
}
export const deleteQuiz = async ({
  deleteQuizAPIRequestData
}: DeleteQuizAPIProps): Promise<ApiResult> => {
  // ファイル・問題番号が未指定(-1)なら、削除する問題を取得していない
  const invalid = validateRequest(
    deleteQuizAPIRequestSchema,
    deleteQuizAPIRequestData,
    () => MESSAGES.ERROR.MSG00009
  )
  if (invalid) return invalid

  const result = await del(
    '/quiz',
    {
      ...deleteQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result = data.body as QuizApiResponseDto
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
