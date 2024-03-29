import { GridRowsProp } from '@mui/x-data-grid';
import {
  DeleteQuizInfoState,
  DisplayWordTestState,
  EditQueryOfSaying,
  InputSayingState,
  IntegrateToQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfDeleteQuizState,
  QueryOfGetAccuracyState,
  QueryOfGetWordState,
  QueryOfIntegrateToQuizState,
  QueryOfSearchQuizState,
  QueryOfSearchWordState,
  WordMeanData,
  WordSourceData,
  WordSubSourceData
} from '../../interfaces/state';
import { del, get, patch, post, put } from './API';
import { getBook } from './response';
import { InputExampleData } from '@/pages/englishBot/addExample';
import {
  AddDataApiResponse,
  EnglishBotTestFourChoiceResponse,
  GetAccuracyRateByCategoryAPIResponseDto,
  getDateForSqlString,
  GetQuizApiResponseDto,
  GetRandomWordAPIResponseDto,
  GetSayingAPIResponseDto,
  GetWordBynameAPIResponseDto,
  ProcessingAddApiReponse,
  ProcessingApiReponse,
  WordSearchAPIResponseDto
} from 'quizzer-lib';
import { meanOfAddWordDto, SendToAddWordApiData } from '../../interfaces/api/response';

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
        const res: GetQuizApiResponseDto[] = data.body as GetQuizApiResponseDto[];
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
  setAccuracyData?: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
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
        const res: GetAccuracyRateByCategoryAPIResponseDto[] = data.body as GetAccuracyRateByCategoryAPIResponseDto[];
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
        const res: GetRandomWordAPIResponseDto[] = data.body as GetRandomWordAPIResponseDto[];
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

interface AddWordButtonProps {
  inputWord: string;
  meanRowList: meanOfAddWordDto[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputWord?: React.Dispatch<React.SetStateAction<string>>;
  setMeanRowList?: React.Dispatch<React.SetStateAction<meanOfAddWordDto[]>>;
}

// 登録ボタン押下後。単語と意味をDBに登録
export const addWordAPI = async ({
  inputWord,
  meanRowList,
  setMessage,
  setInputWord,
  setMeanRowList
}: AddWordButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setInputWord || !setMeanRowList) {
    return;
  }

  if (inputWord === '') {
    setMessage({
      message: 'エラー:単語が入力されておりません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  for (let i = 0; i < meanRowList.length; i++) {
    if (meanRowList[i].pos.id === -1 || (meanRowList[i].pos.id === -2 && !meanRowList[i].pos.name)) {
      setMessage({
        message: `エラー:${i + 1}行目の品詞を入力してください`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (!meanRowList[i].mean || meanRowList[i].mean === '') {
      setMessage({
        message: `エラー:${i + 1}行目の意味を入力してください`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }
  }

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  await post(
    '/english/word/add',
    {
      wordName: inputWord,
      pronounce: '',
      meanArrayData: meanRowList.reduce((previousValue: SendToAddWordApiData[], currentValue) => {
        if (currentValue.pos.id !== -1) {
          previousValue.push({
            partOfSpeechId: currentValue.pos.id,
            sourceId: currentValue.source.id,
            meaning: currentValue.mean || '',
            partOfSpeechName: currentValue.pos.name,
            sourceName: currentValue.source.name
          });
        }
        return previousValue;
      }, [])
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: `単語「${inputWord}」を登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputWord('');
        setMeanRowList([]);
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  ).catch((err) => {
    console.error(`API Error2(word add). ${JSON.stringify(err)},err:${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

// 英単語検索
interface SearchWordAPIProps {
  query: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchWordAPI = ({ query, setMessage, setSearchResult }: SearchWordAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setSearchResult) {
    return;
  }

  if (!query || query === '') {
    setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error' });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  get(
    '/english/word/byname',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetWordBynameAPIResponseDto[] = data.body as GetWordBynameAPIResponseDto[];
        setSearchResult(result || []);
        setMessage({
          message: 'Success!!取得しました',
          messageColor: 'success.light',
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
      name: query
    }
  );
};

// 例文データ登録
interface SubmitExampleSentenseAPIProps {
  inputExampleData: InputExampleData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const submitExampleSentenseAPI = ({
  inputExampleData,
  setMessage,
  setInputExampleData
}: SubmitExampleSentenseAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setInputExampleData) {
    return;
  }

  if (!inputExampleData || !inputExampleData.exampleEn || inputExampleData.exampleEn === '') {
    setMessage({
      message: 'エラー:例文(英文)が入力されていません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!inputExampleData.exampleJa || inputExampleData.exampleJa === '') {
    setMessage({
      message: 'エラー:例文(和文)が入力されていません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  } else if (!inputExampleData.meanId || inputExampleData.meanId.length === 0) {
    setMessage({
      message: 'エラー:単語または意味へのチェック指定がありません',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
  post(
    '/english/example',
    {
      exampleEn: inputExampleData.exampleEn,
      exampleJa: inputExampleData.exampleJa,
      meanId: inputExampleData.meanId
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessage({
          message: '例文を登録しました',
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputExampleData({});
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

// 単語検索
interface SearchWordForDictionaryAPIProps {
  queryOfSearchWord: QueryOfSearchWordState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchWordForDictionary = ({
  queryOfSearchWord,
  setMessage,
  setSearchResult
}: SearchWordForDictionaryAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessage || !setSearchResult) {
    return;
  }

  if (!queryOfSearchWord.query || queryOfSearchWord.query === '') {
    setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  get(
    '/english/word/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const result: WordSearchAPIResponseDto[] = data.body as WordSearchAPIResponseDto[];
        setSearchResult(result || []);
        setMessage({
          message: 'Success!!' + result.length + '問の問題を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setSearchResult([]);
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
      wordName: queryOfSearchWord.query,
      subSourceName: queryOfSearchWord.subSource?.query || ''
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

interface searchSayingAPIProps {
  queryOfSaying: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchSayingAPI = async ({ queryOfSaying, setMessageStater, setSearchResult }: searchSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setSearchResult) {
    return;
  }

  await get(
    '/saying/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: [] = data.body as [];
        setSearchResult(res);
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
      saying: queryOfSaying
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

interface getSayingAPIProps {
  id: number;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const getSayingByIdAPI = async ({ id, setMessageStater, setEditQueryOfSaying }: getSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  if (isNaN(id) || id < 0) {
    setMessageStater({
      message: `エラー:入力したIDが不正です:${id}`,
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  await get(
    `/saying/${id}`,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: GetSayingAPIResponseDto[] = data.body as GetSayingAPIResponseDto[];
        setEditQueryOfSaying({
          id: id,
          saying: res[0].saying,
          explanation: res[0].explanation
        });
        setMessageStater({
          message: '格言を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {}
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setEditQueryOfSaying({
      id: -1,
      saying: ''
    });
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface editSayingAPIProps {
  editQueryOfSaying: EditQueryOfSaying;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const editSayingAPI = async ({
  editQueryOfSaying,
  setMessageStater,
  setEditQueryOfSaying
}: editSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  await patch(
    '/saying',
    {
      id: editQueryOfSaying.id,
      saying: editQueryOfSaying.saying,
      explanation: editQueryOfSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        setMessageStater({
          message: 'Success!! 編集に成功しました',
          messageColor: 'success.light',
          isDisplay: true
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
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  setEditQueryOfSaying({
    id: -1,
    saying: ''
  });
};
