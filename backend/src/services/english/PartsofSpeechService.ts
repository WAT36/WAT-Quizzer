import { getPartsofSpeech } from "./dao/PartsofSpeechDao";

// 品詞取得
export const getPartsofSpeechService = () => {
  return new Promise((resolve, reject) => {
      getPartsofSpeech()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
