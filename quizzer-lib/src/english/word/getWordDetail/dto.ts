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
  synonym_original: {
    word_id: number
    synonym_word_id: number
    synonym_word: {
      name: string
    }
  }[]
  synonym_word: {
    word_id: number
    synonym_word_id: number
    synonym_original: {
      name: string
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
  word_etymology: {
    etymology: {
      id: true
      name: true
    }
  }[]
}
