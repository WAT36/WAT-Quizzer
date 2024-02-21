import { GridRowsProp } from '@mui/x-data-grid';
import {
  AddDataApiResponse,
  AddQuizApiResponse,
  CheckQuizApiResponse,
  EnglishBotTestFourChoiceResponse,
  GetAccuracyRateByCategoryServiceDto,
  ProcessingAddApiReponse,
  ProcessingApiReponse
} from '../../interfaces/api/response';
import { QuizApiResponse, QuizViewApiResponse, WordApiResponse } from '../../interfaces/db';
import {
  DeleteQuizInfoState,
  DisplayQuizState,
  DisplayWordTestState,
  InputSayingState,
  IntegrateToQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfDeleteQuizState,
  QueryOfGetAccuracyState,
  QueryOfGetWordState,
  QueryOfIntegrateToQuizState,
  QueryOfPutQuizState,
  QueryOfQuizState,
  QueryOfSearchQuizState,
  WordMeanData,
  WordSourceData,
  WordSubSourceData
} from '../../interfaces/state';
import { del, get, patch, post, put } from './API';
import { generateQuizSentense, getBook } from './response';
import { getDateForSqlString } from '../../lib/str';

interface AddQuizButtonProps {
  value: number;
  queryOfAddQuizState: QueryOfPutQuizState;
  setAddLog?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryofAddQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

// 問題追加ボタンで利用するAPI
export const addQuizAPI = async ({
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
  await post(
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
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
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

export const clearQuizAPI = async ({
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
  await post(
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
    console.error(`API Error2. ${JSON.stringify(err)}`);
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface FailQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const failQuizAPI = async ({
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
  await post(
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
    console.error(`API Error2. ${JSON.stringify(err)}`);
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

export const getMinimumClearQuizAPI = async ({
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
  await get(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface GetLRUQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getLRUQuizAPI = async ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetLRUQuizButtonProps) => {
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
  await get(
    '/quiz/lru',
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface GetReviewQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getReviewQuizAPI = async ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetReviewQuizButtonProps) => {
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
  await get(
    '/quiz/review',
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface GetRandomQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getRandomQuizAPI = async ({
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
  await get(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface GetWorstRateQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getWorstRateQuizAPI = async ({
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
  await get(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface ReverseCheckQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const reverseCheckQuizAPI = async ({
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
  await post(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

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
        const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
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
        const res: QuizApiResponse[] = data.body as QuizApiResponse[];
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
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const res: QuizApiResponse[] = data.body as QuizApiResponse[];
        setIntegrateToQuizInfoState({
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
      file_num: String(queryOfIntegrateToQuizState.fileNum),
      quiz_num: String(queryOfIntegrateToQuizState.quizNum),
      format: queryOfIntegrateToQuizState.format || ''
    }
  );
};

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

interface GetAccuracyProps {
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setAccuracyData?: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryServiceDto>>;
}
export const getAccuracy = ({ queryOfGetAccuracy, setMessage, setAccuracyData }: GetAccuracyProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setAccuracyData) {
    return;
  }

  if (queryOfGetAccuracy.fileNum === -1) {
    setMessage({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  get(
    '/category/rate',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: GetAccuracyRateByCategoryServiceDto[] = data.body as GetAccuracyRateByCategoryServiceDto[];
        setAccuracyData(res[0]);
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
      file_num: String(queryOfGetAccuracy.fileNum)
    }
  );
};

interface UpdateCategoryProps {
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
}
export const updateCategory = ({ queryOfGetAccuracy, setMessage }: UpdateCategoryProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage) {
    return;
  }

  if (queryOfGetAccuracy.fileNum === -1) {
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
  post(
    '/category',
    {
      file_num: queryOfGetAccuracy.fileNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: '指定問題ファイルへのカテゴリ更新に成功しました',
          messageColor: 'success.light',
          isDisplay: true
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
export const editEnglishWordMeanAPI = async ({
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

  await patch(
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
            messageColor: 'success.light',
            isDisplay: true
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
            messageColor: 'error',
            isDisplay: true
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
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
export const editEnglishWordSourceAPI = async ({
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

  await put(
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
            messageColor: 'success.light',
            isDisplay: true
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
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
};

interface AddEnglishWordSubSourceButtonProps {
  wordId: number;
  subSourceName: string;
  wordSubSourceData: WordSubSourceData[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubSourceName?: React.Dispatch<React.SetStateAction<string>>;
  setWordSubSourceData?: React.Dispatch<React.SetStateAction<WordSubSourceData[]>>;
}

// TODO ここのAPI部分は分けたい
export const addEnglishWordSubSourceAPI = async ({
  wordId,
  subSourceName,
  wordSubSourceData,
  setMessage,
  setModalIsOpen,
  setSubSourceName,
  setWordSubSourceData
}: AddEnglishWordSubSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (!subSourceName || subSourceName === '') {
    if (setMessage) {
      setMessage({ message: 'エラー:出典を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await put(
    '/english/word/subsource',
    {
      wordId: wordId,
      subSource: subSourceName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        const editedWordSubSourceData = wordSubSourceData;
        editedWordSubSourceData.push({
          subSourceName: subSourceName
        });
        if (setWordSubSourceData) {
          setWordSubSourceData(editedWordSubSourceData);
        }

        setSubSourceName && setSubSourceName('');
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
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
    sendData.source = String(queryOfGetWordState.source);
  }
  if (queryOfGetWordState.subSource && queryOfGetWordState.subSource.startDate) {
    sendData.startDate = getDateForSqlString(queryOfGetWordState.subSource.startDate);
  }
  if (queryOfGetWordState.subSource && queryOfGetWordState.subSource.endDate) {
    sendData.endDate = getDateForSqlString(queryOfGetWordState.subSource.endDate);
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  });

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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface SubmitEnglishBotTestButtonProps {
  wordId: number;
  selectedValue: boolean | undefined;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const submitEnglishBotTestAPI = async ({
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
  await post(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

// 啓発本と格言系

interface AddBookButtonProps {
  bookName: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const addBookAPI = async ({ bookName, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }
  if (!bookName || bookName === '') {
    setMessageStater({ message: 'エラー:本の名前を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
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
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  getBook(setMessageStater, setBooklistoption);
};

interface AddSayingButtonProps {
  inputSaying: InputSayingState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputSaying?: React.Dispatch<React.SetStateAction<InputSayingState>>;
}

export const addSayingAPI = async ({ inputSaying, setMessageStater, setInputSaying }: AddSayingButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setInputSaying) {
    return;
  }

  if (!inputSaying.bookId || inputSaying.bookId === -1) {
    setMessageStater({ message: 'エラー:本名を選択して下さい', messageColor: 'error', isDisplay: true });
    return;
  } else if (!inputSaying.saying || inputSaying.saying === '') {
    setMessageStater({ message: 'エラー:格言を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
    '/saying',
    {
      book_id: inputSaying.bookId,
      saying: inputSaying.saying,
      explanation: inputSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規格言「${inputSaying}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputSaying({
          bookId: -1,
          saying: '',
          explanation: ''
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  //getBook(setMessageStater, setBooklistoption);
};
