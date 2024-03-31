import { post } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';
import {
  QueryOfDeleteQuizState,
  QueryOfIntegrateToQuizState,
  MessageState,
  DeleteQuizInfoState,
  IntegrateToQuizInfoState
} from '../../../interfaces/state';

interface IntegrateQuizButtonProps {
  queryOfDeleteQuizState: QueryOfDeleteQuizState;
  queryOfIntegrateToQuizState: QueryOfIntegrateToQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfDeleteQuizState?: React.Dispatch<React.SetStateAction<QueryOfDeleteQuizState>>;
  setQueryOfIntegrateToQuizState?: React.Dispatch<React.SetStateAction<QueryOfIntegrateToQuizState>>;
  setDeleteQuizInfoState?: React.Dispatch<React.SetStateAction<DeleteQuizInfoState>>;
  setIntegrateToQuizInfoState?: React.Dispatch<React.SetStateAction<IntegrateToQuizInfoState>>;
}
export const integrateQuiz = ({
  queryOfDeleteQuizState,
  queryOfIntegrateToQuizState,
  setMessage,
  setQueryOfDeleteQuizState,
  setQueryOfIntegrateToQuizState,
  setDeleteQuizInfoState,
  setIntegrateToQuizInfoState
}: IntegrateQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (
    !setMessage ||
    !setDeleteQuizInfoState ||
    !setIntegrateToQuizInfoState ||
    !setQueryOfDeleteQuizState ||
    !setQueryOfIntegrateToQuizState
  ) {
    return;
  }

  if (!queryOfIntegrateToQuizState.fileNum || !queryOfIntegrateToQuizState.quizNum) {
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
  post(
    '/quiz/integrate',
    {
      pre_file_num: queryOfDeleteQuizState.fileNum,
      pre_quiz_num: queryOfDeleteQuizState.quizNum,
      post_file_num: queryOfIntegrateToQuizState.fileNum,
      post_quiz_num: queryOfIntegrateToQuizState.quizNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        let quiz_num =
          '[' +
          queryOfDeleteQuizState.fileNum +
          ':' +
          queryOfDeleteQuizState.quizNum +
          '->' +
          queryOfIntegrateToQuizState.quizNum +
          ']';
        setMessage({
          message: 'Success! 統合に成功しました' + quiz_num,
          messageColor: 'success.light',
          isDisplay: true
        });
        setQueryOfDeleteQuizState({
          fileNum: -1,
          quizNum: -1,
          format: 'basic'
        });
        setQueryOfIntegrateToQuizState({
          fileNum: -1,
          quizNum: -1,
          format: 'basic'
        });
        setDeleteQuizInfoState({});
        setIntegrateToQuizInfoState({});
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
