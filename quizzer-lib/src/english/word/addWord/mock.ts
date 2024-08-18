import { AddWordAPIRequestDto } from '.'

export const initAddWordRequestData: AddWordAPIRequestDto = {
  inputWord: {
    wordName: '',
    sourceId: -1,
    subSourceName: ''
  },
  pronounce: '',
  meanArrayData: []
}
