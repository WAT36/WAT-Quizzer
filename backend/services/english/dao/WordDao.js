const database = require('../../../common/Database')

// SQL
const addWordSQL = `
    INSERT INTO
        word (name,pronounce)
    VALUES(?,?)
    ;
`

const addMeanSQL = `
    INSERT INTO
        mean (word_id,wordmean_id,partsofspeech_id,meaning)
    VALUES(?,?,?,?)
    ;
`

// 単語と意味追加
const addWordAndMean = async (wordName, pronounce, meanArrayData) => {
  try {
    let wordData = await database.execQueryForEnglish(addWordSQL, [
      wordName,
      pronounce
    ])

    for (let i = 0; i < meanArrayData.length; i++) {
      await database.execQueryForEnglish(addMeanSQL, [
        wordData.insertId,
        i + 1,
        meanArrayData[i].partOfSpeechId,
        meanArrayData[i].meaning
      ])
    }
    return { wordData }
  } catch (error) {
    throw error
  }
}

const searchWordSQL = `
    SELECT 
      * 
    FROM 
      word
    WHERE
      name LIKE ?
    ORDER BY
      name, id
    ;
`

// 単語検索
const searchWord = async (wordName) => {
  try {
    let wordData = await database.execQueryForEnglish(searchWordSQL, [
      '%' + (wordName || '') + '%'
    ])
    return { wordData }
  } catch (error) {
    throw error
  }
}

// 指定単語名の意味を取得
const getWordMeanSQL = `
    SELECT 
      mean.wordmean_id,
      mean.meaning,
      partsofspeech.name as partsofspeech
    FROM 
      word
    INNER JOIN
      mean
    ON
      word.id = mean.word_id
    INNER JOIN
      partsofspeech
    ON
      mean.partsofspeech_id = partsofspeech.id
    WHERE
      word.name = ?
    ORDER BY
      mean.wordmean_id
    ;
`

// 単語意味検索
const getWordMean = async (wordName) => {
  try {
    let wordData = await database.execQueryForEnglish(getWordMeanSQL, [
      wordName
    ])
    return { wordData }
  } catch (error) {
    throw error
  }
}

module.exports = {
  addWordAndMean,
  searchWord,
  getWordMean
}
