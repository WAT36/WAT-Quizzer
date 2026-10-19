import type { ApiResponse } from '../../..'

export interface GetImageOfQuizAPIRequestDto {
  fileName: string
}

export interface GetImageOfQuizAPIResponseDto extends ApiResponse {
  imageUrl: string
}
