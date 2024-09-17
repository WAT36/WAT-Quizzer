import { ApiResult } from '../../../api'
import { GetQuizAPIRequestDto } from '../../../..'

interface GetImageOfQuizButtonProps {
  getQuizRequestData: GetQuizAPIRequestDto
}

export const getImageOfQuizAPI = async ({
  getQuizRequestData
}: GetImageOfQuizButtonProps): Promise<ApiResult> => {
  if (!getQuizRequestData.file_num) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  // TODO  API処理
  // そういえばまだ未実装
  return {
    message: {
      message: 'TODO 未実装',
      messageColor: 'common.black',
      isDisplay: true
    }
  }
}
