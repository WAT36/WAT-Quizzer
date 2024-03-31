import { GetPopularEventResponse, GetSelfHelpBookResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { PartofSpeechApiResponse, WordSummaryApiResponse } from '../../interfaces/db';
import { MessageState, PullDownOptionState } from '../../interfaces/state';
import { get } from './API';

// TODO この辺の関数群は適切なファイル名フォルダ構成にしてわかりやすいように振り分けるべき

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

// englishbot用 単語熟語統計データを取ってくる
export const getWordSummaryData = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setWordSummary: React.Dispatch<React.SetStateAction<WordSummaryApiResponse[]>>
) => {
  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3' });

  const storageKey = 'wordSummaryData';
  const savedSummaryData = sessionStorage.getItem(storageKey);
  if (!savedSummaryData) {
    get('/english/word/summary', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: WordSummaryApiResponse[] = data.body as WordSummaryApiResponse[];
        setWordSummary(result);
        setMessageStater({ message: '　', messageColor: 'common.black' });
        // session storageに保存
        sessionStorage.setItem(storageKey, JSON.stringify(result));
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setWordSummary(JSON.parse(savedSummaryData));
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
      } else {
        setEventList([{ name: `Error:${data.status}`, link: '' }]);
      }
    });
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    setEventList(JSON.parse(savedEventList) as GetPopularEventResponse[]);
  }
};
