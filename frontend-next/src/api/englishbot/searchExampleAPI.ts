import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, GetWordBynameAPIResponseDto, SearchExampleAPIResponseDto } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/api/API';

// 例文検索
interface SearchExampleAPIProps {
  query: string;
  isLinked: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchExampleAPI = ({ query, isLinked, setMessage, setSearchResult }: SearchExampleAPIProps) => {
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
    '/english/example',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: SearchExampleAPIResponseDto[] = data.body as SearchExampleAPIResponseDto[];

        if (result.length === 0) {
          setMessage({
            message: 'エラー:条件に合うデータはありません',
            messageColor: 'error',
            isDisplay: true
          });
          return;
        }

        setSearchResult(result);
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
      query,
      isLinked
    }
  );
};
