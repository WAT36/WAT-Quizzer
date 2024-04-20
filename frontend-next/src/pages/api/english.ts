import { get } from '@/api/API';
import { EnglishWordByIdApiResponse, ProcessingApiSingleReponse } from 'quizzer-lib';
import { MessageState, WordDetailData } from '../../../interfaces/state';

export const getWordDetail = async (
  id: string,
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setWordDetail: React.Dispatch<React.SetStateAction<WordDetailData>>
) => {
  get(
    '/english/word/' + id,
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200) {
        const result: EnglishWordByIdApiResponse = data.body as EnglishWordByIdApiResponse;
        setWordDetail(result);
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    {}
  );
};
