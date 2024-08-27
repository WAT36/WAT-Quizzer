import { GetWordDetailAPIResponseDto } from '.'

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
