require('Promise');

const QuizFileDao = require('./dao/QuizFileDao');

// 問題ファイルのリスト取得
const getQuizFileList = () => {
    return new Promise((resolve, reject) =>{
        QuizFileDao.getFileList()
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
    getQuizFileList,
}
