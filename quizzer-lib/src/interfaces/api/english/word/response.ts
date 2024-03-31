import { ApiResponse } from '../../response'

// 英単語検索APIレスポンス型
export interface WordSearchAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
}

// 英単語取得系APIレスポンス型
// word(単語)からの取得結果
export interface GetWordAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

// 英単語取得(byname)系APIレスポンス型
export interface GetWordBynameAPIResponseDto extends ApiResponse {
  word_id: number
  name: string
  pronounce: string
  mean_id: number
  wordmean_id: number
  meaning: string
  partsofspeech_id: number
  partsofspeech: string
}

// 英単語ランダム取得APIレスポンス型
export interface GetRandomWordAPIResponseDto extends ApiResponse {
  id: number
  name: string
}

// 四択問題選択肢取得APIレスポンス型
export interface GetFourChoiceAPIResponseDto extends ApiResponse {
  id: number
  word_id: number
  wordmean_id: number
  partsofspeech_id: number
  meaning: string
}
export interface FourChoiceAPIResponseDto extends ApiResponse {
  correct: {
    mean: string
  }
  dummy: {
    mean: string
  }[]
}

// 四択問題選択肢取得APIレスポンス型
export interface GetWordSummaryAPIResponseDto extends ApiResponse {
  name: string
  count: number
}

// 単語の出典取得APIレスポンス型
export interface GetSourceOfWordAPIResponseDto extends ApiResponse {
  word_id: number
  word_name: string
  source_id: number
  source_name: string
}

// 単語のサブ出典取得APIレスポンス型
export interface GetSubSourceOfWordAPIResponseDto extends ApiResponse {
  subsource: string
}
