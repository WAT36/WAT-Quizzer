import type { DownloadQuizCsvApiRequest } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'
import type { ApiResult } from '../../..'
import { authFetch } from '../../..'

interface DownloadQuizCsvAPIProps {
  downloadQuizCsvApiRequest: DownloadQuizCsvApiRequest
}

export const downloadQuizCsvAPI = async ({
  downloadQuizCsvApiRequest
}: DownloadQuizCsvAPIProps): Promise<ApiResult> => {
  if (
    !downloadQuizCsvApiRequest.file_num ||
    downloadQuizCsvApiRequest.file_num === -1
  ) {
    return {
      isSuccess: false,
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    }
  }

  // TODO 共通APIを使うように変更したい
  const result = await authFetch(
    (process.env.NEXT_PUBLIC_API_SERVER || '') +
      `/quiz/file/csv?file_num=${downloadQuizCsvApiRequest.file_num}`,
    {
      method: 'GET'
    }
  )
  if (!result.ok) {
    return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00004) }
  }
  const blob = await result.blob()

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
  window.URL.revokeObjectURL(url)
  return {
    isSuccess: true,
    message: successMessage(MESSAGES.SUCCESS.MSG00022),
    result: {}
  }
}
