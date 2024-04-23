import { GetQuizApiResponseDto, ProcessingApiSingleReponse } from 'quizzer-lib';
import { QueryOfIntegrateToQuizState, MessageState, DeleteQuizInfoState } from '../../../interfaces/state';
import { get } from '@/api/API';

interface GetIntegrateToQuizButtonProps {
  queryOfIntegrateToQuizState: QueryOfIntegrateToQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setIntegrateToQuizInfoState?: React.Dispatch<React.SetStateAction<DeleteQuizInfoState>>;
}
// TODO getQuizと統合したい
export const getIntegrateToQuiz = ({
  queryOfIntegrateToQuizState,
  setMessage,
  setIntegrateToQuizInfoState
}: GetIntegrateToQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setIntegrateToQuizInfoState) {
    return;
  }

  if (queryOfIntegrateToQuizState.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfIntegrateToQuizState.quizNum) {
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
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 200) {
        const res: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto;
        setIntegrateToQuizInfoState({
          fileNum: res.file_num,
          quizNum: res.quiz_num,
          sentense: res.quiz_sentense,
          answer: res.answer,
          category: res.category,
          image: res.img_file
        });
        setMessage({
          message: '　',
          messageColor: 'commmon.black',
          isDisplay: false
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
    },
    {
      file_num: String(queryOfIntegrateToQuizState.fileNum),
      quiz_num: String(queryOfIntegrateToQuizState.quizNum),
      format: queryOfIntegrateToQuizState.format || ''
    }
  );
};
