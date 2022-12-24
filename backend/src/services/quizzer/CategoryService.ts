import {
  getAccuracyRateByCategory,
  getCategoryList,
  replaceAllCategory
} from './dao/CategoryDao'

// 問題ファイルのカテゴリリスト取得
export const getCategoryListService = (file_num: number) => {
  return new Promise((resolve, reject) => {
    getCategoryList(file_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// カテゴリリスト総入れ替え（更新）
export const replaceAllCategoryService = (file_num: number) => {
  return new Promise((resolve, reject) => {
    replaceAllCategory(file_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// カテゴリ毎の正解率取得
export const getAccuracyRateByCategoryService = (file_num: number) => {
  return new Promise((resolve, reject) => {
    getAccuracyRateByCategory(file_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
