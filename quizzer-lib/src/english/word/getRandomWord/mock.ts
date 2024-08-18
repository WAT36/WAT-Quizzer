import { GetRandomWordAPIResponse } from '.'

export const initGetRandomWordResponseData: GetRandomWordAPIResponse = {
  id: 1,
  name: 'test',
  pronounce: '',
  mean: [
    {
      meaning: '意味１',
      partsofspeech: {
        name: '品詞１'
      }
    },
    {
      meaning: '意味２',
      partsofspeech: {
        name: '品詞２'
      }
    }
  ],
  word_source: [
    {
      source: {
        name: '出典１'
      }
    }
  ]
}
