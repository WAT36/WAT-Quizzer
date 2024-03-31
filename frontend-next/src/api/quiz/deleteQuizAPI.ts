import { del } from '@/api/API';
import { DeleteQuizInfoState, MessageState, QueryOfDeleteQuizState } from '../../../interfaces/state';
import { ProcessingApiReponse } from 'quizzer-lib';

interface DeleteQuizButtonProps {
  queryOfDeleteQuizState: QueryOfDeleteQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfDeleteQuizState?: React.Dispatch<React.SetStateAction<QueryOfDeleteQuizState>>;
  setDeleteQuizInfoState?: React.Dispatch<React.SetStateAction<DeleteQuizInfoState>>;
}
export const deleteQuiz = ({
  queryOfDeleteQuizState,
  setMessage,
  setQueryOfDeleteQuizState,
  setDeleteQuizInfoState
}: DeleteQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setDeleteQuizInfoState || !setQueryOfDeleteQuizState) {
    return;
  }

  if (!queryOfDeleteQuizState.fileNum || !queryOfDeleteQuizState.quizNum) {
    setMessage({
      message: 'エラー:削除する問題を取得して下さい',
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
  del(
    '/quiz',
    {
      file_num: queryOfDeleteQuizState.fileNum,
      quiz_num: queryOfDeleteQuizState.quizNum,
      format: queryOfDeleteQuizState.format
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        let quiz_num = '[' + queryOfDeleteQuizState.fileNum + '-' + queryOfDeleteQuizState.quizNum + ']';
        setMessage({
          message: 'Success! 削除に成功しました' + quiz_num,
          messageColor: 'success.light',
          isDisplay: true
        });
        setDeleteQuizInfoState({});
        setQueryOfDeleteQuizState({
          fileNum: -1,
          quizNum: -1,
          format: 'basic'
        });
      } else if (data.status === 404) {
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
    }
  );
};
