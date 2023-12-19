import {
  AddDataApiResponse,
  AddQuizApiResponse,
  CheckQuizApiResponse,
  EnglishBotTestFourChoiceResponse,
  ProcessingAddApiReponse,
  ProcessingApiReponse
} from '../../interfaces/api/response';
import { QuizViewApiResponse, WordApiResponse } from '../../interfaces/db';
import {
  DisplayQuizState,
  DisplayWordTestState,
  MessageState,
  PullDownOptionState,
  QueryOfGetWordState,
  QueryOfPutQuizState,
  QueryOfQuizState,
  WordMeanData,
  WordSourceData
} from '../../interfaces/state';
import { get, patch, post, put } from './API';
import { generateQuizSentense, getBook } from './response';

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
  ).catch((err) => {
    console.error(`API Error. ${JSON.stringify(err)}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
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
  ).catch((err) => {
    console.error(`API Error. ${JSON.stringify(err)}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
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
  );
};

interface FailQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const failQuizAPI = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: FailQuizButtonProps) => {
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
    '/quiz/fail',
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
          message: `問題[${queryOfQuizState.quizNum}] 不正解+1.. 登録しました`,
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
  ).catch((err) => {
    console.error(`API Error. ${JSON.stringify(err)}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface GetImageOfQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getImageOfQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetImageOfQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  // TODO  API処理
  // そういえばまだ未実装
};

interface GetMinimumClearQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getMinimumClearQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetMinimumClearQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/quiz/minimum',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setQueryofQuizStater({
          ...queryOfQuizState,
          quizNum: res[0].quiz_num
        });
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          checked: res[0].checked || false,
          expanded: false,
          ...generateQuizSentense(sendData.format, res)
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
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
  );
};

interface GetQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofPutQuiz?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const getQuizAPI = ({
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
  get(
    '/quiz',
    (data: ProcessingApiReponse) => {
      if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else if (data.status === 200) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
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
  );
};

interface GetRandomQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getRandomQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetRandomQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/quiz/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setQueryofQuizStater({
          ...queryOfQuizState,
          quizNum: res[0].quiz_num
        });
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          checked: res[0].checked || false,
          expanded: false,
          ...generateQuizSentense(sendData.format, res)
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
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
  );
};

interface GetWorstRateQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getWorstRateQuizAPI = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetWorstRateQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/quiz/worst',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
        setQueryofQuizStater({
          ...queryOfQuizState,
          quizNum: res[0].quiz_num
        });
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          checked: res[0].checked || false,
          expanded: false,
          ...generateQuizSentense(sendData.format, res)
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
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
  );
};

interface ReverseCheckQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const reverseCheckQuizAPI = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: ReverseCheckQuizButtonProps) => {
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
    '/quiz/check',
    {
      format: queryOfQuizState.format,
      file_num: queryOfQuizState.fileNum,
      quiz_num: queryOfQuizState.quizNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: CheckQuizApiResponse[] = data.body as CheckQuizApiResponse[];
        setDisplayQuizStater({
          ...displayQuizState,
          checked: res[0].result
        });
        setMessageStater({
          message: `問題[${queryOfQuizState.quizNum}] にチェック${res[0].result ? 'をつけ' : 'を外し'}ました`,
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

// 以下 EnglishBot系

interface EditEnglishWordMeanButtonProps {
  meanData: WordMeanData[];
  meanDataIndex: number;
  inputEditData: WordMeanData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMeanDataIndex?: React.Dispatch<React.SetStateAction<number>>;
  setInputEditData?: React.Dispatch<React.SetStateAction<WordMeanData>>;
  setMeanData?: React.Dispatch<React.SetStateAction<WordMeanData[]>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordMeanAPI = ({
  meanData,
  meanDataIndex,
  inputEditData,
  setMessage,
  setModalIsOpen,
  setMeanDataIndex,
  setInputEditData,
  setMeanData
}: EditEnglishWordMeanButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (inputEditData.partofspeechId === -1) {
    if (setMessage) {
      setMessage({ message: 'エラー:品詞を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  patch(
    '/english/word/' + String(inputEditData.wordId),
    {
      wordId: inputEditData.wordId,
      wordMeanId: inputEditData.wordmeanId,
      meanId: inputEditData.meanId,
      partofspeechId: inputEditData.partofspeechId,
      meaning: inputEditData.mean
    },
    (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        }
        const editedMeanData = meanData;
        if (inputEditData.meanId === -1) {
          // 意味を新規追加時
          const responseBody = data.body as AddDataApiResponse;
          editedMeanData.push({ ...inputEditData, meanId: responseBody.insertId });
        } else {
          // 意味を編集時
          editedMeanData[meanDataIndex] = inputEditData;
        }
        if (setMeanData) {
          setMeanData(editedMeanData);
        }
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
      if (setMeanDataIndex) {
        setMeanDataIndex(-1);
      }
      if (setInputEditData) {
        setInputEditData({
          wordId: inputEditData.wordId,
          wordName: '',
          wordmeanId: -1,
          meanId: -1,
          mean: '',
          partofspeechId: -1,
          partofspeechName: ''
        });
      }
    }
  );
};

interface EditEnglishWordSourceButtonProps {
  meanData: WordMeanData[];
  sourceList: PullDownOptionState[];
  wordSourceData: WordSourceData[];
  selectedWordSourceIndex: number;
  inputSourceId: number;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setWordSourceData?: React.Dispatch<React.SetStateAction<WordSourceData[]>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordSourceAPI = ({
  meanData,
  sourceList,
  wordSourceData,
  selectedWordSourceIndex,
  inputSourceId,
  setMessage,
  setModalIsOpen,
  setWordSourceData
}: EditEnglishWordSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (inputSourceId === -1) {
    if (setMessage) {
      setMessage({ message: 'エラー:出典を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  put(
    '/english/word/source',
    {
      meanId: meanData.map((x) => x.meanId),
      oldSourceId: selectedWordSourceIndex === -1 ? -1 : wordSourceData[selectedWordSourceIndex].sourceId,
      newSourceId: inputSourceId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        }
        const editedWordSourceData = wordSourceData;
        if (selectedWordSourceIndex === -1) {
          editedWordSourceData.push({
            // TODO  wordidは最悪いらない、ここの扱いをどうしようか・・
            wordId: -1,
            wordName: '',
            sourceId: inputSourceId,
            sourceName: sourceList.reduce((previousValue, currentValue) => {
              return +currentValue.value === inputSourceId ? previousValue + currentValue.label : previousValue;
            }, '')
          });
        } else {
          editedWordSourceData[selectedWordSourceIndex] = {
            ...wordSourceData[selectedWordSourceIndex],
            sourceId: inputSourceId,
            sourceName: sourceList.reduce((previousValue, currentValue) => {
              return +currentValue.value === inputSourceId ? previousValue + currentValue.label : previousValue;
            }, '')
          };
        }

        if (setWordSourceData) {
          setWordSourceData(editedWordSourceData);
        }
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    }
  );
};

interface GetRandomWordButtonProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const getRandomWordAPI = async ({
  queryOfGetWordState,
  setMessageStater,
  setDisplayWordTest
}: GetRandomWordButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayWordTest) {
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {};
  if (queryOfGetWordState.source) {
    sendData.sourceId = String(queryOfGetWordState.source);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  const wordData = await get(
    '/english/word/random',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: WordApiResponse[] = data.body as WordApiResponse[];
        setDisplayWordTest({
          wordName: res[0].name
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
        return {
          id: res[0].id,
          name: res[0].name
        };
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
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
  );

  await get(
    '/english/word/fourchoice',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: EnglishBotTestFourChoiceResponse[] = data.body as EnglishBotTestFourChoiceResponse[];
        setDisplayWordTest({
          wordId: +wordData.id,
          wordName: wordData.name,
          choice: {
            correct: res[0].correct,
            dummy: res[0].dummy
          }
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {
      wordId: String(wordData.id)
    }
  );
};

interface SubmitEnglishBotTestButtonProps {
  wordId: number;
  selectedValue: boolean | undefined;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const submitEnglishBotTestAPI = ({
  wordId,
  selectedValue,
  setMessageStater,
  setDisplayWordTestState
}: SubmitEnglishBotTestButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayWordTestState) {
    return;
  }

  if (selectedValue === undefined) {
    setMessageStater({
      message: 'エラー:解答が入力されていません',
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
    selectedValue ? '/english/word/test/clear' : '/english/word/test/fail',
    {
      wordId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setDisplayWordTestState({});
        setMessageStater({
          message: `${selectedValue ? '正解+1!' : '不正解+1..'} 登録しました`,
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

// 啓発本と格言系

interface AddBookButtonProps {
  bookName: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const addBookAPI = ({ bookName, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }
  if (!bookName || bookName === '') {
    setMessageStater({ message: 'エラー:本の名前を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  post(
    '/saying/book',
    {
      book_name: bookName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規ファイル「${bookName}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  );
  getBook(setMessageStater, setBooklistoption);
};

interface AddSayingButtonProps {
  selectedBookId: number;
  inputSaying: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const addSayingAPI = ({
  selectedBookId,
  inputSaying,
  setMessageStater,
  setBooklistoption
}: AddSayingButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }

  if (!selectedBookId) {
    setMessageStater({ message: 'エラー:本名を選択して下さい', messageColor: 'error', isDisplay: true });
    return;
  } else if (!inputSaying || inputSaying === '') {
    setMessageStater({ message: 'エラー:格言を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  post(
    '/saying',
    {
      book_id: selectedBookId,
      saying: inputSaying
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規格言「${inputSaying}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  );
  getBook(setMessageStater, setBooklistoption);
};
