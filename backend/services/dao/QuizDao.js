const database = require('../../common/Database');

// SQL 
const getQuizSQL = `
    SELECT
        *
    FROM
        quiz
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 問題取得
const getQuiz = async (file_num, quiz_num) => {
    try{
        let data = await database.execQuery(getQuizSQL,[file_num,quiz_num]);
        return data
    }catch(error){
        throw error;
    }
}

module.exports = {
    getQuiz
}
