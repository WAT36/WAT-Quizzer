import { get } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfPutQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizApiResponseDto, ProcessingApiReponse } from 'quizzer-lib';
import { generateQuizSentense } from '@/common/response';

interface GetQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofPutQuiz?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const getQuizAPI = async ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofPutQuiz
}: GetQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || (!setDisplayQuizStater && !setQueryofPutQuiz)) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfQuizState.quizNum || queryOfQuizState.quizNum === -1) {
    setMessageStater({
      message: 'エラー:問題番号を入力して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    quiz_num: String(queryOfQuizState.quizNum),
    format: queryOfQuizState.format
  };

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  await get(
    '/quiz',
    (data: ProcessingApiReponse) => {
      if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else if (data.status === 200) {
        const res: GetQuizApiResponseDto[] = data.body as GetQuizApiResponseDto[];
        if (setDisplayQuizStater) {
          setDisplayQuizStater({
            fileNum: res[0].file_num,
            quizNum: res[0].quiz_num,
            checked: res[0].checked || false,
            expanded: false,
            ...generateQuizSentense(queryOfQuizState.format, res)
          });
        }
        if (setQueryofPutQuiz) {
          setQueryofPutQuiz((prev) => ({
            format: prev.format,
            formatValue: prev.formatValue,
            fileNum: res[0].file_num,
            quizNum: res[0].quiz_num,
            question: res[0].quiz_sentense,
            answer: res[0].answer,
            category: res[0].category,
            img_file: res[0].img_file,
            matched_basic_quiz_id: res[0].matched_basic_quiz_id,
            dummy1: res[0].dummy_choice_sentense, //四択問題のダミー選択肢１
            dummy2: res[1] ? res[1].dummy_choice_sentense : undefined, //四択問題のダミー選択肢２
            dummy3: res[2] ? res[2].dummy_choice_sentense : undefined, //四択問題のダミー選択肢３
            explanation: res[0].explanation
          }));
        }
        setMessageStater({
          message: '　',
          messageColor: 'success.light',
          isDisplay: false
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    sendData
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
