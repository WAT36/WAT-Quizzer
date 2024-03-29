import { GetQuizApiResponseDto, ProcessingApiReponse } from 'quizzer-lib';
import { DeleteQuizInfoState, MessageState, QueryOfDeleteQuizState } from '../../../interfaces/state';
import { get } from '@/common/API';

interface GetDeletingQuizButtonProps {
  queryOfDeleteQuizState: QueryOfDeleteQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDeleteQuizInfoState?: React.Dispatch<React.SetStateAction<DeleteQuizInfoState>>;
}
// TODO getQuizと統合したい
export const getDeletingQuiz = ({
  queryOfDeleteQuizState,
  setMessage,
  setDeleteQuizInfoState
}: GetDeletingQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setDeleteQuizInfoState) {
    return;
  }

  if (queryOfDeleteQuizState.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfDeleteQuizState.quizNum) {
    setMessage({
      message: 'エラー:問題番号を入力して下さい',
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
    '/quiz',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const res: GetQuizApiResponseDto[] = data.body as GetQuizApiResponseDto[];
        setDeleteQuizInfoState({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          sentense: res[0].quiz_sentense,
          answer: res[0].answer,
          category: res[0].category,
          image: res[0].img_file
        });
        setMessage({
          message: '　',
          messageColor: 'commmon.black',
          isDisplay: false
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
      file_num: String(queryOfDeleteQuizState.fileNum),
      quiz_num: String(queryOfDeleteQuizState.quizNum),
      format: queryOfDeleteQuizState.format || ''
    }
  );
};
