const mysql = require('mysql2');

const database = require('../../common/Database');

// SQL 
const getFileListSQL = `
    SELECT
        *
    FROM
        quiz_file
    ORDER BY
        file_num;
`

// 問題ファイルリスト取得
const getFileList = async () => {
    try{
        let data = await database.execQuery(getFileListSQL);
        return data
    }catch(error){
        throw error;
    }
}

module.exports = {
    getFileList
}
