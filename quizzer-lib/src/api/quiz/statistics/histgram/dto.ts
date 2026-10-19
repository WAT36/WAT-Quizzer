import type { ApiResponse } from '../../..'

export interface GetAccuracyRateHistgramAPIRequestDto {
  file_num?: number
}

export interface AccuracyRateHistgramApiResponse extends ApiResponse {
  result: number[]
}
