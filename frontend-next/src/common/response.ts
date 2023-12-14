import { GetPopularEventResponse, GetSelfHelpBookResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { PartofSpeechApiResponse, QuizFileApiResponse, QuizViewApiResponse } from '../../interfaces/db';
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

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (format: string, res: QuizViewApiResponse[]) => {
  if (format === '4choice') {
    const choices = [];
    choices.push(res[0].answer);
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].dummy_choice_sentense || '');
    }
    // 選択肢の配列をランダムに並び替える
    const choiceName = ['A', 'B', 'C', 'D'];
    choiceName.sort((a, b) => 0.5 - Math.random());

    return {
      quizSentense: `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}
        A: ${choices[choiceName.indexOf('A')]}
        B: ${choices[choiceName.indexOf('B')]}
        C: ${choices[choiceName.indexOf('C')]}
        D: ${choices[choiceName.indexOf('D')]}`,
      quizAnswer: `${choiceName[0]}: ${res[0].answer}`,
      explanation: res[0].explanation
        ? res[0].explanation
            .replaceAll('{c}', choiceName[0])
            .replaceAll('{d1}', choiceName[1])
            .replaceAll('{d2}', choiceName[2])
            .replaceAll('{d3}', choiceName[3])
        : ''
    };
  } else {
    return {
      quizSentense: `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}`,
      quizAnswer: res[0].answer,
      explanation: res[0].explanation
    };
  }
};

// 設定ページ用 啓発本名リストをapi通信して取ってくる
export const getBook = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setBooklistoption: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>
) => {
  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  get('/saying/book', (data: ProcessingApiReponse) => {
    if (data.status === 200) {
      const result: GetSelfHelpBookResponse[] = data.body as GetSelfHelpBookResponse[];
      let booklist: PullDownOptionState[] = [];
      for (var i = 0; i < result.length; i++) {
        booklist.push({
          value: String(result[i].id),
          label: result[i].name
        });
      }
      setBooklistoption(booklist);
      setMessageStater({ message: '　', messageColor: 'common.black', isDisplay: false });
    } else {
      setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
    }
  });
};

// englishbot用 出典リストをapi通信して取ってくる
export const getSourceList = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setSourcelistoption: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>
) => {
  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3' });

  const storageKey = 'sourceList';
  const savedFileList = sessionStorage.getItem(storageKey);
  if (!savedFileList) {
    get('/english/source', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetSelfHelpBookResponse[] = data.body as GetSelfHelpBookResponse[];
        let sourcelist: PullDownOptionState[] = [];
        for (var i = 0; i < result.length; i++) {
          sourcelist.push({
            value: String(result[i].id),
            label: result[i].name
          });
        }
        setSourcelistoption(sourcelist);
        setMessageStater({ message: '　', messageColor: 'common.black' });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setSourcelistoption(JSON.parse(savedFileList));
    setMessageStater({
      message: '　',
      messageColor: 'common.black'
    });
  }
};

// englishbot用 品詞リストをapi通信して取ってくる
export const getPartOfSpeechList = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setPartOfSpeechOption: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>
) => {
  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3' });

  const storageKey = 'partOfSpeechList';
  const savedFileList = sessionStorage.getItem(storageKey);
  if (!savedFileList) {
    get('/english/partsofspeech', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: PartofSpeechApiResponse[] = data.body as PartofSpeechApiResponse[];
        let posList: PullDownOptionState[] = [];
        for (var i = 0; i < result.length; i++) {
          posList.push({
            value: String(result[i].id),
            label: result[i].name
          });
        }
        setPartOfSpeechOption(posList);
        setMessageStater({ message: '　', messageColor: 'common.black' });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setPartOfSpeechOption(JSON.parse(savedFileList));
    setMessageStater({
      message: '　',
      messageColor: 'common.black'
    });
  }
};

// イベントリストをapi通信して取ってくる
export const getPopularEventList = async (
  setEventList: React.Dispatch<React.SetStateAction<GetPopularEventResponse[]>>
) => {
  const storageKey = 'popularEventList';
  const savedEventList = sessionStorage.getItem(storageKey);
  if (!savedEventList) {
    await get('/scrape/connpass/best', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetPopularEventResponse[] = data.body as GetPopularEventResponse[];
        setEventList(result);
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setEventList(JSON.parse(savedEventList) as GetPopularEventResponse[]);
  }
};
