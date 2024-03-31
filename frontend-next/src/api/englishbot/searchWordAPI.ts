import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, GetWordBynameAPIResponseDto } from 'quizzer-lib';
import { MessageState } from '../../../interfaces/state';
import { get } from '@/common/API';

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

  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  get(
    '/english/word/byname',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetWordBynameAPIResponseDto[] = data.body as GetWordBynameAPIResponseDto[];
        setSearchResult(result || []);
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
