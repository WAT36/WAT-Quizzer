import { get } from '@/api/API';
import { DisplayQuizState, MessageState, QueryOfPutQuizState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizApiResponseDto, ProcessingApiSingleReponse, generateQuizSentense } from 'quizzer-lib';

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
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 404) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else if (data.status === 200) {
        const res: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto;
        if (setDisplayQuizStater) {
          setDisplayQuizStater({
            fileNum: res.file_num,
            quizNum: res.quiz_num,
            checked: res.checked || false,
            expanded: false,
            ...generateQuizSentense(queryOfQuizState.format, res)
          });
        }
        if (setQueryofPutQuiz) {
          setQueryofPutQuiz((prev) => ({
            format: prev.format,
            formatValue: prev.formatValue,
            fileNum: res.file_num,
            quizNum: res.quiz_num,
            question: res.quiz_sentense,
            answer: res.answer,
            category: res.category,
            img_file: res.img_file,
            matched_basic_quiz_id:
              res.quiz_basis_advanced_linkage && res.quiz_basis_advanced_linkage.length > 0
                ? JSON.stringify(
                    res.quiz_basis_advanced_linkage.map((x) => {
                      return x.basis_quiz_id;
                    })
                  )
                    .slice(1)
                    .slice(0, -1)
                : '',
            dummy1: res.dummy_choice && res.dummy_choice[0].dummy_choice_sentense, //四択問題のダミー選択肢１
            dummy2: res.dummy_choice && res.dummy_choice[1].dummy_choice_sentense, //四択問題のダミー選択肢２
            dummy3: res.dummy_choice && res.dummy_choice[2].dummy_choice_sentense, //四択問題のダミー選択肢３
            explanation: res.advanced_quiz_explanation?.explanation
          }));
        }
        setMessageStater({
          message: '問題を取得しました',
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
