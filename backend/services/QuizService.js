require('Promise');

const QuizDao = require('./dao/QuizDao');

// ファイル番号、問題番号から問題取得
const getQuiz = (file_num,quiz_num) => {
    return new Promise((resolve, reject) =>{
        QuizDao.getQuiz(file_num,quiz_num)
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
    getQuiz,
}
