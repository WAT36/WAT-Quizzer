import { ProcessingApiReponse } from '../../interfaces/api/response';
import { QuizFileApiResponse, QuizViewApiResponse } from '../../interfaces/db';
import { MessageState, PullDownOptionState } from '../../interfaces/state';
import { get } from './API';

// TODO この辺の関数群は適切なファイル名フォルダ構成にしてわかりやすいように振り分けるべき

// quizzer各画面用 問題ファイルリストをapi通信して取ってくる
export const getFileList = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setFilelistoption: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>
) => {
  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
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
          messageColor: 'common.black'
        });
        // session storageに保存
        sessionStorage.setItem(storageKey, JSON.stringify(filelist));
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setFilelistoption(JSON.parse(savedFileList));
    setMessageStater({
      message: '　',
      messageColor: 'common.black'
    });
  }
};

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (format: string, res: QuizViewApiResponse[]) => {
  if (format === '4choice') {
    const choices = [];
    choices.push(res[0].answer);
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].dummy_choice_sentense || '');
    }
    // 選択肢の配列をランダムに並び替える
    choices.sort((a, b) => 0.5 - Math.random());

    return `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}
        A: ${choices[0]}
        B: ${choices[1]}
        C: ${choices[2]}
        D: ${choices[3]}`;
  } else {
    return `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}`;
  }
};
