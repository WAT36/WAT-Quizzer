import type { DownloadQuizCsvAPIRequestDto, DownloadQuizCsvResult } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'

interface DownloadQuizCsvAPIProps {
  downloadQuizCsvRequestData: DownloadQuizCsvAPIRequestDto
}

// 問題ファイルのCSVを取得する（ファイルの保存は画面側で行う）
export const downloadQuizCsvAPI = async ({
  downloadQuizCsvRequestData
}: DownloadQuizCsvAPIProps): Promise<ApiResult> => {
  if (
    !downloadQuizCsvRequestData.file_num ||
    downloadQuizCsvRequestData.file_num === -1
  ) {
    return {
      isSuccess: false,
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    }
  }

  return await get(
    '/quiz/file/csv',
    onSuccess((data: ProcessingApiReponse) => {
      // CSVはJSONとして読めないので、共通処理で文字列のまま渡される
      if (typeof data.body !== 'string') {
        return {
          isSuccess: false,
          message: errorMessage(MESSAGES.ERROR.MSG00004)
        }
      }
      const result: DownloadQuizCsvResult = { csv: data.body }
      return {
        message: successMessage(MESSAGES.SUCCESS.MSG00022),
        result
      }
    }),
    { file_num: downloadQuizCsvRequestData.file_num }
  )
}
