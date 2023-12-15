import { AddQuizApiResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { DisplayQuizState, MessageState, QueryOfPutQuizState, QueryOfQuizState } from '../../interfaces/state';
import { post } from './API';

interface AddQuizButtonProps {
  value: number;
  queryOfAddQuizState: QueryOfPutQuizState;
  setAddLog?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryofAddQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

// 問題追加ボタンで利用するAPI
export const addQuizAPI = ({
  value,
  queryOfAddQuizState,
  setAddLog,
  setMessageStater,
  setQueryofAddQuizStater
}: AddQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setAddLog || !setMessageStater || !setQueryofAddQuizStater) {
    return;
  }
  if (queryOfAddQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfAddQuizState.question || !queryOfAddQuizState.answer) {
    setMessageStater({
      message: 'エラー:問題文及び答えを入力して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 問題形式によりAPI決定
  let apiPath;
  switch (value) {
    case 0:
      apiPath = '/quiz/add';
      break;
    case 1:
      apiPath = '/quiz/advanced';
      break;
    case 2:
      apiPath = '/quiz/advanced/4choice';
      break;
    default:
      setMessageStater({
        message: `エラー：問題形式不正:${value}`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  post(
    apiPath,
    {
      file_num: queryOfAddQuizState.fileNum,
      input_data: queryOfAddQuizState
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
        setMessageStater({
          message: 'Success!! 問題を追加できました!',
          messageColor: 'success.light',
          isDisplay: true
        });
        setAddLog(res[0].result);
        setQueryofAddQuizStater({
          fileNum: queryOfAddQuizState.fileNum,
          quizNum: -1
        });
        //入力データをクリア
        const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
        if (inputQuizField) {
          inputQuizField.value = '';
        }
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};

interface ClearQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const clearQuizAPI = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: ClearQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater) {
    return;
  }

  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!queryOfQuizState.quizNum) {
    setMessageStater({
      message: 'エラー:問題番号を入力して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!displayQuizState.quizSentense || !displayQuizState.quizAnswer) {
    setMessageStater({
      message: 'エラー:問題を出題してから登録して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  post(
    '/quiz/clear',
    {
      format: queryOfQuizState.format,
      file_num: queryOfQuizState.fileNum,
      quiz_num: queryOfQuizState.quizNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setDisplayQuizStater({
          ...displayQuizState,
          quizSentense: '',
          quizAnswer: '',
          checked: false,
          expanded: false
        });
        setMessageStater({
          message: `問題[${queryOfQuizState.quizNum}] 正解+1! 登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  );
};

interface EditQuizButtonProps {
  queryOfEditQuiz: QueryOfPutQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfEditQuiz?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const editQuizAPI = ({ queryOfEditQuiz, setMessage, setQueryOfEditQuiz }: EditQuizButtonProps) => {
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
  post(
    '/quiz/edit',
    {
      format: queryOfEditQuiz.format,
      file_num: queryOfEditQuiz.fileNum,
      quiz_num: queryOfEditQuiz.quizNum,
      question: queryOfEditQuiz.question,
      answer: queryOfEditQuiz.answer,
      category: queryOfEditQuiz.category,
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
          quizNum: -1
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
  );
};
