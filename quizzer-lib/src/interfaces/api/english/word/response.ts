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

// 英単語ランダム取得APIレスポンス型
export interface GetRandomWordAPIResponseDto {
  id: number
  name: string
}

// 四択問題選択肢取得APIレスポンス型
export interface GetFourChoiceAPIResponseDto {
  id: number
  word_id: number
  wordmean_id: number
  partsofspeech_id: number
  meaning: string
}
export interface FourChoiceAPIResponseDto {
  correct: {
    mean: string
  }
  dummy: {
    mean: string
  }[]
}

// 四択問題選択肢取得APIレスポンス型
export interface GetWordSummaryAPIResponseDto {
  name: string
  count: number
}
