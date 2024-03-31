import { ProcessingApiReponse, WordSummaryApiResponse } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/api/API';

// englishbot用 単語熟語統計データを取ってくる
export const getWordSummaryDataAPI = (
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
