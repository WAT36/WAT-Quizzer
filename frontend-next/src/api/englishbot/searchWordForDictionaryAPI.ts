// 単語検索

import { GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, WordSearchAPIResponseDto } from 'quizzer-lib';
import { QueryOfSearchWordState, MessageState } from '../../../interfaces/state';
import { get } from '@/common/API';

// TODO 英単語検索API2つあるのでこっちは消したい
interface SearchWordForDictionaryAPIProps {
  queryOfSearchWord: QueryOfSearchWordState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchWordForDictionary = ({
  queryOfSearchWord,
  setMessage,
  setSearchResult
}: SearchWordForDictionaryAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setSearchResult) {
    return;
  }

  if (!queryOfSearchWord.query || queryOfSearchWord.query === '') {
    setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  get(
    '/english/word/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const result: WordSearchAPIResponseDto[] = data.body as WordSearchAPIResponseDto[];
        setSearchResult(result || []);
        setMessage({
          message: 'Success!!' + result.length + '問の問題を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setSearchResult([]);
        setMessage({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
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
      wordName: queryOfSearchWord.query,
      subSourceName: queryOfSearchWord.subSource?.query || ''
    }
  );
};
