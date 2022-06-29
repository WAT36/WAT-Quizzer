require('Promise');

const CategoryDao = require('./dao/CategoryDao');

// 問題ファイルのカテゴリリスト取得
const getCategoryList = (file_num) => {
    return new Promise((resolve, reject) =>{
        CategoryDao.getCategoryList(file_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題ファイルのカテゴリリスト取得
const replaceAllCategory = (file_num) => {
    return new Promise((resolve, reject) =>{
        CategoryDao.replaceAllCategory(file_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// カテゴリ毎の正解率取得
const getAccuracyRateByCategory = (file_num) => {
    return new Promise((resolve, reject) =>{
        CategoryDao.getAccuracyRateByCategory(file_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// モジュール化
module.exports = {
    getCategoryList,
    replaceAllCategory,
    getAccuracyRateByCategory,
}
