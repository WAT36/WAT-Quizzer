import { execQueryForEnglish } from '../../../common/Database';

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
export const addWordAndMean = async (wordName: string, pronounce: string, meanArrayData: any) => {
  try {
    let wordData: any = await execQueryForEnglish(addWordSQL, [
      wordName,
      pronounce
    ])

    for (let i = 0; i < meanArrayData.length; i++) {
      await execQueryForEnglish(addMeanSQL, [
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
export const searchWord = async (wordName: string) => {
  try {
    let wordData = await execQueryForEnglish(searchWordSQL, [
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
export const getWordMean = async (wordName: string) => {
  try {
    let wordData = await execQueryForEnglish(getWordMeanSQL, [
      wordName
    ])
    return { wordData }
  } catch (error) {
    throw error
  }
}
