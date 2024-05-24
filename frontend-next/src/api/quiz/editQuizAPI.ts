import { AddQuizApiResponse, ProcessingApiReponse } from 'quizzer-lib';
import { MessageState, QueryOfPutQuizState } from '../../../interfaces/state';
import { post } from '@/api/API';

interface EditQuizButtonProps {
  queryOfEditQuiz: QueryOfPutQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfEditQuiz?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const editQuizAPI = async ({ queryOfEditQuiz, setMessage, setQueryOfEditQuiz }: EditQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setQueryOfEditQuiz) {
    return;
  }
  if (queryOfEditQuiz.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfEditQuiz.question || !queryOfEditQuiz.answer) {
    setMessage({
      message: 'エラー:問題文及び答えを入力して下さい',
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
  await post(
    '/quiz/edit',
    {
      format: queryOfEditQuiz.format,
      file_num: queryOfEditQuiz.fileNum,
      quiz_num: queryOfEditQuiz.quizNum,
      question: queryOfEditQuiz.question,
      answer: queryOfEditQuiz.answer,
      category: queryOfEditQuiz.quiz_category,
      img_file: queryOfEditQuiz.img_file,
      matched_basic_quiz_id: queryOfEditQuiz.matched_basic_quiz_id,
      dummy1: queryOfEditQuiz.dummy1,
      dummy2: queryOfEditQuiz.dummy2,
      dummy3: queryOfEditQuiz.dummy3,
      explanation: queryOfEditQuiz.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
        setMessage({
          message: 'Success!! 問題を更新できました!',
          messageColor: 'success.light',
          isDisplay: true
        });
        setQueryOfEditQuiz({
          fileNum: queryOfEditQuiz.fileNum,
          quizNum: -1,
          format: queryOfEditQuiz.format
        });
        //入力データをクリア
        const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
        if (inputQuizField) {
          inputQuizField.value = '';
        }
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
