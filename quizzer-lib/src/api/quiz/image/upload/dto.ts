import type { ApiResponse } from '../../..'

export interface UploadImageOfQuizAPIRequestDto {
  file: File
}

// 画像アップロードAPIのレスポンス（保存したファイル名。バケット名を出さないためURLは返さない）
export interface UploadImageOfQuizAPIResponseDto extends ApiResponse {
  fileName: string
}
