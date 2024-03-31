import { ProcessingApiReponse } from 'quizzer-lib';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { get } from '@/common/API';

// quizzer各画面用 問題ファイルリストをapi通信して取ってくる
export const getQuizFileListAPI = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setFilelistoption: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>
) => {
  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });

  const storageKey = 'fileName';
  const savedFileList = sessionStorage.getItem(storageKey);
  if (!savedFileList) {
    get('/quiz/file', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: QuizFileApiResponse[] = data.body as QuizFileApiResponse[];
        let filelist: PullDownOptionState[] = [];
        for (var i = 0; i < res.length; i++) {
          filelist.push({
            value: String(res[i].file_num),
            label: res[i].file_nickname
          });
        }
        setFilelistoption(filelist);
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
        // session storageに保存
        sessionStorage.setItem(storageKey, JSON.stringify(filelist));
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setFilelistoption(JSON.parse(savedFileList));
    setMessageStater({
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    });
  }
};
