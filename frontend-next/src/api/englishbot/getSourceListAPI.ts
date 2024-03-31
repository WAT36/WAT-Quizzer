import { ProcessingApiReponse, GetSelfHelpBookResponse } from 'quizzer-lib';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { get } from '@/api/API';

// englishbot用 出典リストをapi通信して取ってくる
export const getSourceListAPI = (
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
