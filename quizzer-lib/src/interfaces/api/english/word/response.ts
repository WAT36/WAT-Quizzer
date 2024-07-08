import { ApiResponse } from '../../response'

// 英単語検索APIレスポンス型
export interface WordSearchAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    meaning: string
  }[]
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

//　登録英単語数取得API
export interface GetWordNumResponseDto extends ApiResponse {
  _max: {
    id: number
  }
}

// 英単語取得(byname)系APIレスポンス型
export interface GetWordBynameAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    id: number
    wordmean_id: number
    meaning: string
    partsofspeech: {
      id: number
      name: string
    }
  }[]
}

// 例文検索APIレスポンス型
export interface SearchExampleAPIResponseDto extends ApiResponse {
  id: number
  en_example_sentense: string
  ja_example_sentense: string
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
  word: {
    id: number
    name: string
    mean: {
      id: number
      word_id: number
      wordmean_id: number
      partsofspeech_id: number
      meaning: string
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }[]
  }
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

// 英単語ランダム取得APIレスポンス型
export interface GetRandomWordAPIResponse extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    meaning: string
    partsofspeech: {
      name: string
    }
  }[]
  word_source: {
    source: {
      name: string
    }
  }[]
}
