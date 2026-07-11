// 例文テストデータ取得APIリクエスト型
export interface GetExampleTestDataAPIRequestDto {
  sourceId?: number
}

// 例文テストデータ取得APIレスポンス型
export interface GetExampleTestDataAPIResponseDto {
  total?: number
  example?: {
    id: number
    en_example_sentense: string
    ja_example_sentense: string
  }
}
