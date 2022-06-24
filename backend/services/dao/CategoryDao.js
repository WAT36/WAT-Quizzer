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

// カテゴリ全削除SQL
const deleteAllCategorySQL = `
    DELETE FROM 
        category
    WHERE
        file_num = ?;
`

// 問題ファイルからカテゴリを取得
const getDistinctCategoryByFileSQL = `
    SELECT DISTINCT
        category
    FROM
        quiz
    WHERE
        file_num = ? 
    ;
`

// カテゴリ挿入SQL（バルクインサート）
const insertCategoriesSQL = `
    INSERT INTO
        category(file_num, category)
    VALUES ? ;
`

// カテゴリ総入れ替え
const replaceAllCategory = async (file_num) => {
    try{
        //まずカテゴリを全削除
        let data = await database.execQuery(deleteAllCategorySQL,[file_num]);

        //指定ファイルのカテゴリ取得
        let results = await database.execQuery(getDistinctCategoryByFileSQL,[file_num]);

        //カテゴリデータ作成
        let categories = new Set([])
        for(var i=0;i<results.length;i++){
            let result_i = new Set(results[i]['category'].split(':'))
            categories = new Set([...result_i, ...categories])
        }
        categories = Array.from(categories)
        data=[]
        for(var i=0;i<categories.length;i++){
            data.push([file_num,categories[i]])
        }

        //カテゴリデータ全挿入
        let result = await database.execQuery(insertCategoriesSQL,[data]);

        return result
    }catch(error){
        throw error;
    }
}

module.exports = {
    getCategoryList,
    replaceAllCategory,
}
