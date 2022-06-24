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
        console.log("getAllQuizOfFileService")
        getAllQuizOfFile(file_num,input_data)
            .then((result) => {
                console.log("getAllQuizOfFileService.then")
                resolve(result);
            })
            .catch((error) => {
                console.log("getAllQuizOfFileService.error",error)
                reject(error);
            });
    });
};


module.exports = {
    deleteAllQuizOfFile,
    getAllQuizOfFile,
    getAllQuizOfFileService,
}