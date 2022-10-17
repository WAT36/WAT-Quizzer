require("promise");

const wordDao = require("./dao/WordDao");

// 単語と意味追加
const addWordAndMean = (wordName, pronounce, meanArrayData) => {
  return new Promise((resolve, reject) => {
    wordDao
      .addWordAndMean(wordName, pronounce, meanArrayData)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// モジュール化
module.exports = {
  addWordAndMean,
};
