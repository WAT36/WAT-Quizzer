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

// ランダム問題取得SQL（前半） 
let getRandomQuizSQLPre = `
    SELECT
        *
    FROM
        quiz_view
    WHERE
        file_num = ?
    AND accuracy_rate >= ? 
    AND accuracy_rate <= ? 
`

// ランダムに問題取得
const getRandomQuiz = async (file_num,min_rate,max_rate,category,checked) => {
    try{
        let categorySQL = ''
        if(category !== null && category !== undefined){
            categorySQL = ` AND category LIKE '%` + category +`%' `;
        }

        let checkedSQL = ""
        if(checked){
            checkedSQL += ` AND checked = 1 `;
        }

        // ランダム問題取得SQL作成
        const getRandomQuizSQL = 
            getRandomQuizSQLPre 
            + categorySQL 
            + checkedSQL 
            + ' ORDER BY rand() LIMIT 1; '

        let data = await database.execQuery(getRandomQuizSQL,[file_num,min_rate,max_rate]);
        return data
    }catch(error){
        throw error;
    }
}

// 最低正解率問題取得SQL（前半） 
let getWorstRateQuizSQLPre = `
    SELECT
        *
    FROM
        quiz_view
    WHERE
        file_num = ?

`

// 最低正解率問題取得
const getWorstRateQuiz = async (file_num, category, checked) => {
    try{
        let categorySQL = ''
        if(category !== null && category !== undefined){
            categorySQL = ` AND category LIKE '%` + category +`%' `;
        }

        let checkedSQL = ""
        if(checked){
            checkedSQL += ` AND checked = 1 `;
        }

        // ランダム問題取得SQL作成
        const getWorstRateQuizSQL = 
            getWorstRateQuizSQLPre 
            + categorySQL 
            + checkedSQL 
            + ' ORDER BY accuracy_rate LIMIT 1; '

        let data = await database.execQuery(getWorstRateQuizSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

// 最小正解数問題取得SQL（前半） 
let getMinimumClearQuizSQLPre = `
    SELECT
        *
    FROM
        quiz_view
    WHERE
        file_num = ?

`
// 最小正解数問題取得
const getMinimumClearQuiz = async (file_num, category, checked) => {
    try{
        let categorySQL = ''
        if(category !== null && category !== undefined){
            categorySQL = ` AND category LIKE '%` + category +`%' `;
        }

        let checkedSQL = ""
        if(checked){
            checkedSQL += ` AND checked = 1 `;
        }

        // ランダム問題取得SQL作成
        const getMinimumClearQuizSQL = 
        getMinimumClearQuizSQLPre 
            + categorySQL 
            + checkedSQL 
            + ' ORDER BY clear_count LIMIT 1; '

        let data = await database.execQuery(getMinimumClearQuizSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

module.exports = {
    getQuiz,
    getRandomQuiz,
    getWorstRateQuiz,
    getMinimumClearQuiz,
}
