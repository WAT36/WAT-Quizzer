const database = require("../../../common/Database");

// SQL
const getPartsofSpeechListSQL = `
    SELECT
        *
    FROM
        partsofspeech
    ORDER BY
        id
    ;
`;

// 品詞取得
const getPartsofSpeech = async () => {
  try {
    let data = await database.execQueryForEnglish(getPartsofSpeechListSQL, []);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPartsofSpeech,
};
