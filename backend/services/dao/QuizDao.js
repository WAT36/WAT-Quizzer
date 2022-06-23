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

// 正解数取得SQL 
const getCorrectNumSQL = `
    SELECT
        clear_count
    FROM
        quiz
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 正解登録SQL
const inputCorrectSQL = `
    UPDATE
        quiz
    SET
        clear_count = ?
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 正解登録
const correctRegister = async (file_num, quiz_num) => {
    try{
        // 正解数取得
        let data = await database.execQuery(getCorrectNumSQL,[file_num,quiz_num]);
        let clear_count = data[0].clear_count

        // 正解登録
        let result = await database.execQuery(inputCorrectSQL,[clear_count+1,file_num,quiz_num]);
        return result
    }catch(error){
        throw error;
    }
}

// 不正解数取得SQL 
const getIncorrectNumSQL = `
    SELECT
        fail_count
    FROM
        quiz
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 不正解登録SQL
const inputIncorrectSQL = `
    UPDATE
        quiz
    SET
        fail_count = ?
    WHERE
        file_num = ?
        AND quiz_num = ?
    ;
`

// 不正解登録
const incorrectRegister = async (file_num, quiz_num) => {
    try{
        // 不正解数取得
        let data = await database.execQuery(getIncorrectNumSQL,[file_num,quiz_num]);
        let fail_count = data[0].fail_count

        // 不正解登録
        let result = await database.execQuery(inputIncorrectSQL,[fail_count+1,file_num,quiz_num]);
        return result
    }catch(error){
        throw error;
    }
}

// 削除済問題番号取得SQL
const getDeletedQuizNumSQL = `
    SELECT
        quiz_num
    FROM
        quiz
    WHERE
        file_num = ?
        AND deleted = 1
    ORDER BY
        quiz_num
    LIMIT 1
`

// 問題追加SQL (ファイル番号、問題番号、問題文、答え文、カテゴリ、画像ファイル名　を入力)
const addQuizSQL = `
    INSERT INTO
        quiz 
    VALUES(?,?,?,?,0,0,?,?,0,0)
    ;
`

// 問題編集SQL(削除済問題のところにアップデート) 
const editQuizSQL = `
    UPDATE
        quiz
    SET
        quiz_sentense = ? ,
        answer = ? ,
        clear_count = 0, 
        fail_count = 0, 
        category = ? ,
        img_file = ? ,
        checked = 0, 
        deleted = 0 
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
    ;
`
// 問題数確認SQL
const getCountSQL = `
    SELECT 
        count(*) 
    FROM 
        quiz 
    WHERE 
        file_num = ?
`

// 問題追加
const addQuiz = async (file_num, input_data) => {
    try{
        // 入力データを１行ずつに分割
        let data = input_data.split('\n');

        let result = [];

        for(var i=0;i<data.length;i++){

            // 入力データ作成
            let data_i = data[i].split(',')
            let question = data_i[0]
            let answer = data_i[1]
            let category = data_i[2]
            let img_file = data_i[3]

            // データのidを作成
            var new_quiz_id = -1
            // 削除済問題がないかチェック、あればそこに入れる
            let id = await database.execQuery(getDeletedQuizNumSQL,[file_num]);
            if(id.length > 1){
                //削除済問題がある場合はそこに入れる
                new_quiz_id = id[0]['quiz_num'];
                let result_i = await database.execQuery(editQuizSQL,[question,answer,category,img_file,file_num,new_quiz_id]);
                result.push("Added!! ["+file_num+"-"+new_quiz_id+"]:"+question+","+answer)
            }else{
                //削除済問題がない場合は普通にINSERT
                let now_count = await database.execQuery(getCountSQL,[file_num]);
                new_quiz_id = now_count[0]['count(*)'] + 1;
                let result_i = await database.execQuery(addQuizSQL,[file_num,new_quiz_id,question,answer,category,img_file]);
                result.push("Added!! ["+file_num+"-"+new_quiz_id+"]:"+question+","+answer)
            }
        }
        return result;
    }catch(error){
        throw error;
    }
}

// 問題編集
const editQuiz = async (file_num,quiz_num,question,answer,category,img_file) => {
    try{
        let data = await database.execQuery(editQuizSQL,[question,answer,category,img_file,file_num,quiz_num]);
        return data
    }catch(error){
        throw error;
    }
}

// 問題検索SQL（前半） 
let searchQuizSQLPre = `
    SELECT
        file_num, quiz_num AS id, quiz_sentense, answer, clear_count, fail_count, category, img_file, checked, deleted, accuracy_rate 
    FROM
        quiz_view
    WHERE
        file_num = ?
    AND accuracy_rate >= ? 
    AND accuracy_rate <= ? 
`

// 問題検索
const searchQuiz = async (file_num,min_rate,max_rate,category,checked,query,cond) => {
    try{
        let categorySQL = ''
        if(category !== null && category !== undefined){
            categorySQL = ` AND category LIKE '%` + category +`%' `;
        }

        let checkedSQL = ""
        if(checked){
            checkedSQL += ` AND checked = 1 `;
        }

        let querySQL = ""
        let cond_question = (cond !== undefined && cond.question !== undefined && cond.question === true) ? true : false;
        let cond_answer = (cond !== undefined && cond.answer !== undefined && cond.answer === true) ? true : false;
        if(cond_question && !cond_answer){
            querySQL += ` AND quiz_sentense LIKE '%` + query +`%' `;
        }else if(!cond_question && cond_answer){
            querySQL += ` AND answer LIKE '%` + query +`%' `;
        }else{
            querySQL += ` AND (quiz_sentense LIKE '%` + query +`%' OR answer LIKE '%` + query +`%') `;
        }

        // ランダム問題取得SQL作成
        const searchQuizSQL = 
            searchQuizSQLPre 
            + categorySQL 
            + checkedSQL 
            + querySQL
            + ' ORDER BY quiz_num; '

            let data = await database.execQuery(searchQuizSQL,[file_num,min_rate,max_rate]);
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
    correctRegister,
    incorrectRegister,
    addQuiz,
    editQuiz,
    searchQuiz,
}
