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

// ファイル番号等からランダムに問題取得
const getRandomQuiz = (file_num,min_rate,max_rate,category,checked) => {
    return new Promise((resolve, reject) =>{
        QuizDao.getRandomQuiz(file_num,min_rate,max_rate,category,checked)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// ファイル番号等から最低正解率問題取得
const getWorstRateQuiz = (file_num,category,checked) => {
    return new Promise((resolve, reject) =>{
        QuizDao.getWorstRateQuiz(file_num,category,checked)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// ファイル番号等から最小正解数問題取得
const getMinimumClearQuiz = (file_num,category,checked) => {
    return new Promise((resolve, reject) =>{
        QuizDao.getMinimumClearQuiz(file_num,category,checked)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 正解登録
const correctRegister = (file_num,quiz_num) => {
    return new Promise((resolve, reject) =>{
        QuizDao.correctRegister(file_num,quiz_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 不正解登録
const incorrectRegister = (file_num,quiz_num) => {
    return new Promise((resolve, reject) =>{
        QuizDao.incorrectRegister(file_num,quiz_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題追加
const addQuiz = (file_num,input_data) => {
    return new Promise((resolve, reject) =>{
        QuizDao.addQuiz(file_num,input_data)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題編集
const editQuiz = (file_num,quiz_num,question,answer,category,img_file) => {
    return new Promise((resolve, reject) =>{
        QuizDao.editQuiz(file_num,quiz_num,question,answer,category,img_file)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題検索
const searchQuiz = (file_num,min_rate,max_rate,category,checked,query,cond) => {
    return new Promise((resolve, reject) =>{
        QuizDao.searchQuiz(file_num,min_rate,max_rate,category,checked,query,cond)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題削除
const deleteQuiz = (file_num,quiz_num) => {
    return new Promise((resolve, reject) =>{
        QuizDao.deleteQuiz(file_num,quiz_num)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 問題統合
const integrateQuiz = (pre_file_num, pre_quiz_num, post_file_num, post_quiz_num) => {
    return new Promise((resolve, reject) =>{
        QuizDao.integrateQuiz(pre_file_num,pre_quiz_num,post_file_num,post_quiz_num)
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
    getRandomQuiz,
    getWorstRateQuiz,
    getMinimumClearQuiz,
    correctRegister,
    incorrectRegister,
    addQuiz,
    editQuiz,
    searchQuiz,
    deleteQuiz,
    integrateQuiz,
}
