import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, GetWordBynameAPIResponseDto } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/api/API';

// 英単語検索
interface SearchWordAPIProps {
  query: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchWordAPI = ({ query, setMessage, setSearchResult }: SearchWordAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setSearchResult) {
    return;
  }

  if (!query || query === '') {
    setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error' });
    return;
  }
  setSearchResult([]);
  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  get(
    '/english/word/byname',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetWordBynameAPIResponseDto[] = data.body as GetWordBynameAPIResponseDto[];

        if (result.length === 0) {
          setMessage({
            message: 'エラー:条件に合うデータはありません',
            messageColor: 'error',
            isDisplay: true
          });
          return;
        }

        setSearchResult(
          result.reduce(
            (accumulator, currentValue) => {
              for (let i = 0; i < currentValue.mean.length; i++) {
                accumulator.push({
                  ...currentValue.mean[i],
                  partsofspeech: currentValue.mean[i].partsofspeech.name
                });
              }
              return accumulator;
            },
            [] as {
              id: number;
              wordmean_id: number;
              meaning: string;
              partsofspeech: string;
            }[]
          )
        );
        setMessage({
          message: 'Success!!取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {
      name: query
    }
  );
};
