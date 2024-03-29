import { GridRowsProp } from '@mui/x-data-grid';
import { MessageState, QueryOfSearchQuizState } from '../../../interfaces/state';
import { get } from '@/common/API';
import { GetQuizApiResponseDto, ProcessingApiReponse } from 'quizzer-lib';

interface SearchQuizButtonProps {
  queryOfSearchQuizState: QueryOfSearchQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchQuizAPI = ({ queryOfSearchQuizState, setMessage, setSearchResult }: SearchQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setSearchResult) {
    return;
  }

  if (queryOfSearchQuizState.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/quiz/search',
    (data: ProcessingApiReponse) => {
      if ((String(data.status)[0] === '2' || String(data.status)[0] === '3') && data.body?.length > 0) {
        const res: GetQuizApiResponseDto[] = data.body as GetQuizApiResponseDto[];
        setSearchResult(res);
        setMessage({
          message: 'Success!! ' + res.length + '問の問題を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
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
      file_num: String(queryOfSearchQuizState.fileNum),
      query: queryOfSearchQuizState.query || '',
      category: queryOfSearchQuizState.category || '',
      min_rate: queryOfSearchQuizState.minRate ? String(queryOfSearchQuizState.minRate) : '0',
      max_rate: queryOfSearchQuizState.maxRate ? String(queryOfSearchQuizState.maxRate) : '100',
      searchInOnlySentense: String(queryOfSearchQuizState.cond?.question || ''),
      searchInOnlyAnswer: String(queryOfSearchQuizState.cond?.answer || ''),
      checked: queryOfSearchQuizState.checked ? String(queryOfSearchQuizState.checked) : 'false',
      format: queryOfSearchQuizState.format
    }
  );
};
