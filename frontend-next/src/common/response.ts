import { GetPopularEventResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { PartofSpeechApiResponse, WordSummaryApiResponse } from '../../interfaces/db';
import { MessageState, PullDownOptionState } from '../../interfaces/state';
import { get } from './API';

// TODO この辺の関数群は適切なファイル名フォルダ構成にしてわかりやすいように振り分けるべき

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
