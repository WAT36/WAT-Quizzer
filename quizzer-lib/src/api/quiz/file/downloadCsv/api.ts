import { DownloadQuizCsvApiRequest, DownloadQuizCsvApiResponseDto } from '.'
import {
  defaultMessage,
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../../..'
import { get, ApiResult, ProcessingApiReponse, authFetch } from '../../..'
import { Response } from 'express'

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
  const blob = await result.blob()

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
  window.URL.revokeObjectURL(url)
  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00022),
    result: {}
  }
}
