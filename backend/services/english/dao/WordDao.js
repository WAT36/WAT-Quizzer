const database = require("../../../common/Database");

// SQL
const addWordSQL = `
    INSERT INTO
        word (name,pronounce)
    VALUES(?,?)
    ;
`;

const addMeanSQL = `
    INSERT INTO
        mean (word_id,wordmean_id,partsofspeech_id,meaning)
    VALUES(?,?,?,?)
    ;
`;

// 単語と意味追加
const addWordAndMean = async (wordName, pronounce) => {
  try {
    let wordData = await database.execQueryForEnglish(addWordSQL, [
      wordName,
      pronounce,
    ]);
    console.log(wordData);
    console.log(wordData.insertId);
    return { wordData };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addWordAndMean,
};
