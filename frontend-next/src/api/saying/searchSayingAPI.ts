import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, SearchSayingResponse } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/api/API';

interface searchSayingAPIProps {
  queryOfSaying: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchSayingAPI = async ({ queryOfSaying, setMessageStater, setSearchResult }: searchSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setSearchResult) {
    return;
  }

  await get(
    '/saying/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: SearchSayingResponse[] = data.body as SearchSayingResponse[];
        setSearchResult(
          res.map((x) => {
            return {
              id: x.id,
              explanation: x.explanation,
              saying: x.saying,
              name: x.selfhelp_book.name
            };
          })
        );
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {
      saying: queryOfSaying
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
