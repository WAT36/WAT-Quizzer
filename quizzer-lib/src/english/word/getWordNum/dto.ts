import { ApiResponse } from '../../../..'

//　登録英単語数取得API
export interface GetWordNumResponseDto extends ApiResponse {
  _max: {
    id: number
  }
}
