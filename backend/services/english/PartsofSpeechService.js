require("promise");

const partsofSpeechDao = require("./dao/PartsofSpeechDao");

// 品詞取得
const getPartsofSpeech = () => {
  return new Promise((resolve, reject) => {
    partsofSpeechDao
      .getPartsofSpeech()
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
  getPartsofSpeech,
};
