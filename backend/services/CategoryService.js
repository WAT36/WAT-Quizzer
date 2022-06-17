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

// モジュール化
module.exports = {
    getCategoryList,
}
