const mysql = require('mysql2');

const database = require('../common/Database');

// 問題ファイルのリスト取得
const getQuizFileList = function(){
    try{
        // DB接続
        connection = database.getConnection();
        connection.connect();

        // 問題ファイルリスト取得
        connection.query('SELECT * FROM quiz_file;', (err, rows) => {
            if (err){
                throw err;
            }else{
                // 接続終了
                connection.end();
                return rows;
            }
        })
    }catch(error){
        // 接続終了
        connection.end();
        throw error;
    }
}

// モジュール化
module.exports = {
    getQuizFileList,
}


getQuizFileList();