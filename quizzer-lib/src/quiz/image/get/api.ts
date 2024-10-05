import { ApiResult } from '../../../api'
import {
  defaultMessage,
  errorMessage,
  GetQuizAPIRequestDto,
  MESSAGES
} from '../../../..'

interface GetImageOfQuizButtonProps {
  getQuizRequestData: GetQuizAPIRequestDto
}

export const getImageOfQuizAPI = async ({
  getQuizRequestData
}: GetImageOfQuizButtonProps): Promise<ApiResult> => {
  if (!getQuizRequestData.file_num) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  // TODO  API処理
  // そういえばまだ未実装
  return { message: defaultMessage(MESSAGES.DEFAULT.MSG00001) }
}
