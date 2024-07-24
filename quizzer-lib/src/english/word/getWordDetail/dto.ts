import { ApiResponse } from '../../../..'

// 英単語詳細取得APIレスポンス型
export interface GetWordDetailAPIResponseDto extends ApiResponse {
  id: number
  name: string
  pronounce: string
  mean: {
    partsofspeech: {
      id: number
      name: string
    }
    id: number
    wordmean_id: number
    meaning: string
  }[]
  word_source: {
    source: {
      id: number
      name: string
    }
  }[]
  word_subsource: {
    id: number
    subsource: string
    created_at: string
  }[]
  synonym: {
    synonym_group_id: number
    synonym_group: {
      synonym: {
        word_id: number
        word: {
          name: string
        }
      }[]
    }
  }[]
  antonym_original: {
    word_id: number
    antonym_word_id: number
    antonym_word: {
      name: string
    }
  }[]
  antonym_word: {
    word_id: number
    antonym_word_id: number
    antonym_original: {
      name: string
    }
  }[]
  derivative: {
    derivative_group_id: number
    derivative_group: {
      derivative: {
        word_id: number
        word: {
          name: string
        }
      }[]
    }
  }[]
}
