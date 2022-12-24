import { addWordAndMean, getWordMean, searchWord } from './dao/WordDao'

// 単語と意味追加
export const addWordAndMeanService = (
  wordName: string,
  pronounce: string,
  meanArrayData: any
) => {
  return new Promise((resolve, reject) => {
    addWordAndMean(wordName, pronounce, meanArrayData)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 単語を検索
export const searchWordService = (wordName: string) => {
  return new Promise((resolve, reject) => {
    searchWord(wordName)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 単語の意味取得
export const getWordMeanService = (wordName: string) => {
  return new Promise((resolve, reject) => {
    getWordMean(wordName)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
