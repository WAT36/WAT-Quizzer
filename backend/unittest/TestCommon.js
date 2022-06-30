// UT用　共通関数定義ファイル

const database = require('../common/Database');


// 指定ファイルの問題全消しSQL 
const deleteAllQuizOfFileSQL = `
    DELETE FROM
        quiz
    WHERE
        file_num = ?
    ;
`

// 指定ファイルの問題全消し
const deleteAllQuizOfFile = async (file_num) => {
    try{
        let data = await database.execQuery(deleteAllQuizOfFileSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

// 指定ファイルの問題全取得SQL 
const getAllQuizOfFileSQL = `
    SELECT
        *
    FROM
        quiz
    WHERE
        file_num = ?
    ORDER BY
        quiz_num
    ;
`

// 指定ファイルの問題全取得
const getAllQuizOfFile = async (file_num) => {
    try{
        let data = await database.execQuery(getAllQuizOfFileSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

const getAllQuizOfFileService = (file_num,input_data) => {
    return new Promise((resolve, reject) =>{
        getAllQuizOfFile(file_num,input_data)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// 指定問題の正解不正解数を変更するSQL
const updateAnswerNumOfQuizSQL = `
    UPDATE
        quiz
    SET
        clear_count = ?
        ,fail_count = ?
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 指定問題の正解不正解数を変更
const updateAnswerNumOfQuiz = async (clear,fail,file_num,quiz_num) => {
    try{
        let data = await database.execQuery(updateAnswerNumOfQuizSQL,[clear,fail,file_num,quiz_num]);
        return data
    }catch(error){
        throw error;
    }
};

// 指定問題をチェックするSQL
const doCheckQuizSQL = `
    UPDATE
        quiz
    SET
        checked = 1
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`
// 指定問題をチェック
const doCheckQuiz = async (file_num,quiz_num) => {
    try{
        let data = await database.execQuery(doCheckQuizSQL,[file_num,quiz_num]);
        return data
    }catch(error){
        throw error;
    }
};

module.exports = {
    deleteAllQuizOfFile,
    getAllQuizOfFile,
    getAllQuizOfFileService,
    updateAnswerNumOfQuiz,
    doCheckQuiz,
}