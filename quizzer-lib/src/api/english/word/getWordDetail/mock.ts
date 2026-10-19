import type { GetWordDetailAPIResponseDto } from '.'

export const initWordDetailResponseData: GetWordDetailAPIResponseDto = {
  id: -1,
  name: '',
  pronounce: '',
  checked: false,
  mean: [],
  word_source: [],
  word_subsource: [],
  synonym_original: [],
  synonym_word: [],
  antonym_original: [],
  antonym_word: [],
  derivative: {
    derivative_group_id: -1,
    derivative_group: {
      derivative: []
    }
  },
  word_etymology: []
}

// 以下モックデータ(storybook用)
export const mockWordDetailWithAntonyms: GetWordDetailAPIResponseDto = {
  id: 1,
  name: 'happy',
  pronounce: 'ˈhæpi',
  checked: true,
  mean: [
    {
      partsofspeech: {
        id: 1,
        name: '形容詞'
      },
      id: 1,
      wordmean_id: 1,
      meaning: '幸せな'
    }
  ],
  word_source: [],
  word_subsource: [],
  synonym_original: [],
  synonym_word: [],
  antonym_original: [
    {
      word_id: 1,
      antonym_word_id: 2,
      antonym_word: {
        name: 'sad'
      }
    },
    {
      word_id: 1,
      antonym_word_id: 3,
      antonym_word: {
        name: 'unhappy'
      }
    }
  ],
  antonym_word: [
    {
      word_id: 4,
      antonym_word_id: 1,
      antonym_original: {
        name: 'joyful'
      }
    }
  ],
  derivative: {
    derivative_group_id: -1,
    derivative_group: {
      derivative: []
    }
  },
  word_etymology: []
}

export const mockWordDetailWithoutAntonyms: GetWordDetailAPIResponseDto = {
  id: 2,
  name: 'new',
  pronounce: 'njuː',
  checked: false,
  mean: [
    {
      partsofspeech: {
        id: 1,
        name: '形容詞'
      },
      id: 2,
      wordmean_id: 2,
      meaning: '新しい'
    }
  ],
  word_source: [],
  word_subsource: [],
  synonym_original: [],
  synonym_word: [],
  antonym_original: [],
  antonym_word: [],
  derivative: {
    derivative_group_id: -1,
    derivative_group: {
      derivative: []
    }
  },
  word_etymology: []
}

export const mockWordDetailLoading: GetWordDetailAPIResponseDto = {
  id: -1,
  name: '',
  pronounce: '',
  checked: false,
  mean: [],
  word_source: [],
  word_subsource: [],
  synonym_original: [],
  synonym_word: [],
  antonym_original: [],
  antonym_word: [],
  derivative: {
    derivative_group_id: -1,
    derivative_group: {
      derivative: []
    }
  },
  word_etymology: []
}
