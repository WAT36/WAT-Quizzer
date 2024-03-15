// 英単語検索APIレスポンス型
export interface WordSearchAPIResponseDto {
  id: number
  name: string
  pronounce: string
}

// 英単語取得系APIレスポンス型
export interface GetWordAPIResponseDto {
  id: number
  name: string
  pronounce: string
}
