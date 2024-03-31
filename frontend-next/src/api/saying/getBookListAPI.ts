import { ProcessingApiReponse, GetSelfHelpBookResponse } from 'quizzer-lib';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { get } from '@/api/API';

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
