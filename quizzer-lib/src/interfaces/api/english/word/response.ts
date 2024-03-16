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

// 英単語取得(byname)系APIレスポンス型
export interface GetWordBynameAPIResponseDto {
  word_id: number
  name: string
  pronounce: string
  id: number
  wordmean_id: number
  meaning: string
  partsofspeech_id: number
  partsofspeech: string
}
