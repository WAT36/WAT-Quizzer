import { getFileList } from './dao/QuizFileDao';

// 問題ファイルのリスト取得
export const getQuizFileListService = () => {
    return new Promise((resolve, reject) =>{
        getFileList()
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

