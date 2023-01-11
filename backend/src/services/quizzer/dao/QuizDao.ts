import { execQuery } from '../../../common/Database'

// SQL
const getQuizSQL = `
    SELECT
        *
    FROM
        quiz
    WHERE
        file_num = ?
        AND quiz_num = ?
        AND deleted = 0
    ;
`

// 問題取得
export const getQuiz = async (file_num: number, quiz_num: number) => {
  try {
    let data = await execQuery(getQuizSQL, [file_num, quiz_num])
    return data
  } catch (error) {
    throw error
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
    AND deleted = 0 
`

// ランダムに問題取得
export const getRandomQuiz = async (
  file_num: number,
  min_rate: number,
  max_rate: number,
  category: string,
  checked: boolean
) => {
  try {
    let categorySQL = ''
    if (category !== null && category !== undefined) {
      categorySQL = ` AND category LIKE '%` + category + `%' `
    }

    let checkedSQL = ''
    if (checked) {
      checkedSQL += ` AND checked = 1 `
    }

    // ランダム問題取得SQL作成
    const getRandomQuizSQL =
      getRandomQuizSQLPre +
      categorySQL +
      checkedSQL +
      ' ORDER BY rand() LIMIT 1; '

    let data = await execQuery(getRandomQuizSQL, [file_num, min_rate, max_rate])
    return data
  } catch (error) {
    throw error
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
    AND deleted = 0 

`

// 最低正解率問題取得
export const getWorstRateQuiz = async (
  file_num: number,
  category: string,
  checked: boolean
) => {
  try {
    let categorySQL = ''
    if (category !== null && category !== undefined) {
      categorySQL = ` AND category LIKE '%` + category + `%' `
    }

    let checkedSQL = ''
    if (checked) {
      checkedSQL += ` AND checked = 1 `
    }

    // ランダム問題取得SQL作成
    const getWorstRateQuizSQL =
      getWorstRateQuizSQLPre +
      categorySQL +
      checkedSQL +
      ' ORDER BY accuracy_rate LIMIT 1; '

    let data = await execQuery(getWorstRateQuizSQL, [file_num])
    return data
  } catch (error) {
    throw error
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
    AND deleted = 0 

`
// 最小正解数問題取得
export const getMinimumClearQuiz = async (
  file_num: number,
  category: string,
  checked: boolean
) => {
  try {
    let categorySQL = ''
    if (category !== null && category !== undefined) {
      categorySQL = ` AND category LIKE '%` + category + `%' `
    }

    let checkedSQL = ''
    if (checked) {
      checkedSQL += ` AND checked = 1 `
    }

    // ランダム問題取得SQL作成
    const getMinimumClearQuizSQL =
      getMinimumClearQuizSQLPre +
      categorySQL +
      checkedSQL +
      ' ORDER BY clear_count LIMIT 1; '

    let data = await execQuery(getMinimumClearQuizSQL, [file_num])
    return data
  } catch (error) {
    throw error
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
        AND deleted = 0 
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
        AND deleted = 0 
    ;
`

// 正解登録
export const correctRegister = async (file_num: number, quiz_num: number) => {
  try {
    // 正解数取得
    let data: any = await execQuery(getCorrectNumSQL, [file_num, quiz_num])
    let clear_count = data[0].clear_count

    // 正解登録
    let result = await execQuery(inputCorrectSQL, [
      clear_count + 1,
      file_num,
      quiz_num
    ])
    return result
  } catch (error) {
    throw error
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
        AND deleted = 0
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
        AND deleted = 0
    ;
`

// 不正解登録
export const incorrectRegister = async (file_num: number, quiz_num: number) => {
  try {
    // 不正解数取得
    let data: any = await execQuery(getIncorrectNumSQL, [file_num, quiz_num])
    let fail_count = data[0].fail_count

    // 不正解登録
    let result = await execQuery(inputIncorrectSQL, [
      fail_count + 1,
      file_num,
      quiz_num
    ])
    return result
  } catch (error) {
    throw error
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
    AND deleted = 0
`

// 問題追加
export const addQuiz = async (file_num: number, input_data: string) => {
  try {
    // 入力データを１行ずつに分割
    let data = input_data.split('\n')

    let result = []

    for (var i = 0; i < data.length; i++) {
      // 入力データ作成
      let data_i = data[i].split(',')
      let question = data_i[0]
      let answer = data_i[1]
      let category = data_i[2]
      let img_file = data_i[3]

      // データのidを作成
      var new_quiz_id = -1
      // 削除済問題がないかチェック、あればそこに入れる
      let id: any = await execQuery(getDeletedQuizNumSQL, [file_num])
      if (id.length > 0) {
        //削除済問題がある場合はそこに入れる
        new_quiz_id = id[0]['quiz_num']
        let result_i = await execQuery(editQuizSQL, [
          question,
          answer,
          category,
          img_file,
          file_num,
          new_quiz_id
        ])
        result.push(
          'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer
        )
      } else {
        //削除済問題がない場合は普通にINSERT
        let now_count: any = await execQuery(getCountSQL, [file_num])
        new_quiz_id = now_count[0]['count(*)'] + 1
        let result_i = await execQuery(addQuizSQL, [
          file_num,
          new_quiz_id,
          question,
          answer,
          category,
          img_file
        ])
        result.push(
          'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer
        )
      }
    }
    return result
  } catch (error) {
    throw error
  }
}

// 問題編集
export const editQuiz = async (
  file_num: number,
  quiz_num: number,
  question: string,
  answer: string,
  category: string,
  img_file: string
) => {
  try {
    let data = await execQuery(editQuizSQL, [
      question,
      answer,
      category,
      img_file,
      file_num,
      quiz_num
    ])
    return data
  } catch (error) {
    throw error
  }
}

// 問題検索SQL（前半）
let searchQuizSQLPre = `
    SELECT
        file_num, quiz_num AS id, quiz_sentense, answer, clear_count, fail_count, category, img_file, checked, deleted, ROUND(accuracy_rate,1) AS accuracy_rate 
    FROM
        quiz_view
    WHERE
        file_num = ?
    AND accuracy_rate >= ? 
    AND accuracy_rate <= ? 
    AND deleted = 0 
`

// 問題検索
export const searchQuiz = async (
  file_num: number,
  min_rate: number,
  max_rate: number,
  category: string,
  checked: boolean,
  query: string,
  cond: any
) => {
  try {
    let categorySQL = ''
    if (category !== null && category !== undefined) {
      categorySQL = ` AND category LIKE '%` + category + `%' `
    }

    let checkedSQL = ''
    if (checked) {
      checkedSQL += ` AND checked = 1 `
    }

    let querySQL = ''
    let cond_question =
      cond !== undefined &&
      cond.question !== undefined &&
      cond.question === true
        ? true
        : false
    let cond_answer =
      cond !== undefined && cond.answer !== undefined && cond.answer === true
        ? true
        : false
    if (cond_question && !cond_answer) {
      querySQL += ` AND quiz_sentense LIKE '%` + query + `%' `
    } else if (!cond_question && cond_answer) {
      querySQL += ` AND answer LIKE '%` + query + `%' `
    } else {
      querySQL +=
        ` AND (quiz_sentense LIKE '%` +
        query +
        `%' OR answer LIKE '%` +
        query +
        `%') `
    }

    // ランダム問題取得SQL作成
    const searchQuizSQL =
      searchQuizSQLPre +
      categorySQL +
      checkedSQL +
      querySQL +
      ' ORDER BY quiz_num; '

    let data = await execQuery(searchQuizSQL, [file_num, min_rate, max_rate])
    return data
  } catch (error) {
    throw error
  }
}

// 問題削除SQL(削除済にアップデート)
const deleteQuizSQL = `
    UPDATE
        quiz
    SET
        deleted = 1 
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
    ;
`

// 問題削除
export const deleteQuiz = async (file_num: number, quiz_num: number) => {
  try {
    // 削除済にアップデート
    let result = await execQuery(deleteQuizSQL, [file_num, quiz_num])
    return result
  } catch (error) {
    throw error
  }
}

// 問題統合SQL
const integrateQuizSQL = `
    UPDATE
        quiz
    SET
        clear_count = ?,
        fail_count = ?,
        category = ?
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
`

// 問題統合
export const integrateQuiz = async (
  pre_file_num: number,
  pre_quiz_num: number,
  post_file_num: number,
  post_quiz_num: number
) => {
  try {
    if (pre_file_num !== post_file_num) {
      throw (
        '統合前後のファイル番号は同じにしてください (' +
        pre_file_num +
        ' != ' +
        post_file_num +
        ')'
      )
    }

    // 統合前の問題取得
    let pre_data: any = await execQuery(getQuizSQL, [
      pre_file_num,
      pre_quiz_num
    ])

    // 統合後の問題取得
    let post_data: any = await execQuery(getQuizSQL, [
      post_file_num,
      post_quiz_num
    ])

    // 統合データ作成
    const new_clear_count =
      pre_data[0]['clear_count'] + post_data[0]['clear_count']
    const new_fail_count =
      pre_data[0]['fail_count'] + post_data[0]['fail_count']
    const pre_category = new Set(pre_data[0]['category'].split(':'))
    const post_category = new Set(post_data[0]['category'].split(':'))
    const new_category = Array.from(
      new Set([...pre_category, ...post_category])
    ).join(':')

    // 問題統合
    let result = []
    let result_i = await execQuery(integrateQuizSQL, [
      new_clear_count,
      new_fail_count,
      new_category,
      post_file_num,
      post_quiz_num
    ])
    result.push(result_i)

    // 統合元データは削除
    result_i = await execQuery(deleteQuizSQL, [pre_file_num, pre_quiz_num])
    result.push(result_i)

    return result
  } catch (error) {
    throw error
  }
}

// 問題のカテゴリ取得SQL
const getCategoryOfQuizSQL = `
    SELECT
      category
    FROM
      quiz
    WHERE 
      file_num = ? 
      AND quiz_num = ? 
`

// 問題のカテゴリ更新SQL
const updateCategoryOfQuizSQL = `
    UPDATE
        quiz
    SET
        category = ?
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
`

// 問題にカテゴリ追加
export const addCategoryToQuiz = async (
  file_num: number,
  quiz_num: number,
  category: string
) => {
  try {
    // 現在のカテゴリ取得
    let nowCategory: any = await execQuery(getCategoryOfQuizSQL, [
      file_num,
      quiz_num
    ])
    nowCategory = nowCategory[0]['category']

    // カテゴリ追加
    let newCategory = nowCategory + ':' + category
    while (newCategory.includes('::')) {
      newCategory = newCategory.replace('::', ':')
    }

    // 更新
    const result = await execQuery(updateCategoryOfQuizSQL, [
      newCategory,
      file_num,
      quiz_num
    ])

    return result
  } catch (error) {
    throw error
  }
}

// 問題からカテゴリ削除
export const removeCategoryFromQuiz = async (
  file_num: number,
  quiz_num: number,
  category: string
) => {
  try {
    // 現在のカテゴリ取得
    let nowCategory: any = await execQuery(getCategoryOfQuizSQL, [
      file_num,
      quiz_num
    ])
    nowCategory = nowCategory[0]['category']

    // 指定カテゴリが含まれているか確認、含まれていなければ終了
    if (!nowCategory.includes(category)) {
      return {
        result: null
      }
    }

    // カテゴリ削除
    let newCategory: string = nowCategory.replace(category, '')
    if (newCategory[0] === ':') {
      newCategory = newCategory.slice(1)
    }
    if (newCategory.slice(-1) === ':') {
      newCategory = newCategory.slice(0, -1)
    }
    while (newCategory.includes('::')) {
      newCategory = newCategory.replace('::', ':')
    }

    // 更新
    const result = await execQuery(updateCategoryOfQuizSQL, [
      newCategory,
      file_num,
      quiz_num
    ])

    return {
      result
    }
  } catch (error) {
    throw error
  }
}

// 問題にチェックつけるSQL
const checkToQuizSQL = `
    UPDATE
        quiz
    SET
        checked = true
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
`

// 問題にチェック追加
export const checkToQuiz = async (file_num: number, quiz_num: number) => {
  try {
    // 更新
    const result = await execQuery(checkToQuizSQL, [file_num, quiz_num])

    return result
  } catch (error) {
    throw error
  }
}

// 問題にチェック外すSQL
const uncheckToQuizSQL = `
    UPDATE
        quiz
    SET
        checked = false
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
`

// 問題にチェック外す
export const uncheckToQuiz = async (file_num: number, quiz_num: number) => {
  try {
    // 更新
    const result = await execQuery(uncheckToQuizSQL, [file_num, quiz_num])

    return result
  } catch (error) {
    throw error
  }
}

// 問題のチェック取得するSQL
const getCheckOfQuizSQL = `
    SELECT
        checked
    FROM
        quiz
    WHERE 
        file_num = ? 
        AND quiz_num = ? 
`

// 問題のチェック反転する
export const reverseCheckToQuiz = async (file_num: number, quiz_num: number) => {
  try {
    // チェック取得
    const result: any = await execQuery(getCheckOfQuizSQL, [file_num, quiz_num])
    const checked = result[0].checked

    let response;
    if(checked){
      response = await execQuery(checkToQuizSQL, [file_num, quiz_num])
    }else{
      response = await execQuery(uncheckToQuizSQL, [file_num, quiz_num])
    }

    return response
  } catch (error) {
    throw error
  }
}