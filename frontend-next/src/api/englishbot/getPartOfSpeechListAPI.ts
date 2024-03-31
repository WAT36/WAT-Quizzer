import { ProcessingApiReponse } from 'quizzer-lib';
import { PartofSpeechApiResponse } from '../../../interfaces/db';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { get } from '@/api/API';

// englishbot用 品詞リストをapi通信して取ってくる
export const getPartOfSpeechListAPI = (
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
