const database = require('../../common/Database');

// SQL 
const getCategoryByFileSQL = `
    SELECT
        *
    FROM
        category
    WHERE
        file_num = ? 
    ORDER BY
        category;
`

// 問題ファイルリスト取得
const getCategoryList = async (file_num) => {
    try{
        let data = await database.execQuery(getCategoryByFileSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

module.exports = {
    getCategoryList
}
