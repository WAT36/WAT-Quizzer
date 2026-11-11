import type { ApiResponse } from '../../..'

export interface GetImageOfQuizAPIRequestDto {
  fileName: string
}

// バックエンドが返す画像データ
export interface GetImageOfQuizAPIRawResponseDto extends ApiResponse {
  base64: string
  mimeType: string
}

// 画面で<img>のsrcにそのまま使えるdata URLにしたもの
export interface GetImageOfQuizAPIResponseDto extends ApiResponse {
  imageUrl: string
}
