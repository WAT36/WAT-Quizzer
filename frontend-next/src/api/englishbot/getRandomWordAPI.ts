import { ProcessingApiSingleReponse, GetRandomWordAPIResponse } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/api/API';

// englishbot用 単語ランダム取得をapi通信して取ってくる
export const getRandomWordAPI = (
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setRandomWord: React.Dispatch<React.SetStateAction<GetRandomWordAPIResponse>>,
  accessToken?: string
) => {
  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3' });

  get(
    '/english/word/random',
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200) {
        const result: GetRandomWordAPIResponse = data.body as GetRandomWordAPIResponse;
        setRandomWord(result);
        setMessageStater({ message: '　', messageColor: 'common.black' });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error' });
      }
    },
    undefined,
    undefined,
    accessToken
  );
};
