import {
  ApiResult,
  errorMessage,
  getRandomIntWithRange,
  MESSAGES,
  quizCategoryMockData,
  quizFileMockData,
  quizFormatMockData,
  quizMockData,
  sayingMockData,
  selfhelpBookMockData,
  successMessage,
  englishDataMock,
  englishExamplesMockData,
  WordSummaryApiResponse,
  CategoryParentChildAPIResponseDto,
  CategoryQuizCountDto,
  RecommendedCategoryDto
} from 'quizzer-lib';

// モック用のAPI関数群
export const mockGetQuizAPI = async (params: any): Promise<ApiResult> => {
  // 問題を返す（通常取得以外はランダム） TODO チェック済とか問題種別とかカテゴリに対応する？
  const quizList = quizMockData.filter((quiz) => quiz.file_num === params.getQuizRequestData.file_num);
  const quiz = params.getQuizMethod
    ? quizList[Math.floor(Math.random() * quizList.length)]
    : quizList.find((quiz) => quiz.quiz_num === params.getQuizRequestData.quiz_num);

  return quiz
    ? {
        message: successMessage(MESSAGES.SUCCESS.MSG00001),
        result: quiz
      }
    : { message: errorMessage(MESSAGES.ERROR.MSG00004) };
};

export const mockSearchQuizAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の問題を返す
  const searchResults = quizMockData;

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00015.replace('{0}', String(searchResults.length)),
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetQuizFileListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: quizFileMockData
  };
};

export const mockGetQuizFormatListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: false
    },
    result: quizFormatMockData
  };
};

export const mockGetCategoryListAPI = async (file_num: string): Promise<ApiResult> => {
  const quizIdList = quizMockData.filter((quiz) => quiz.file_num === +file_num).map((quiz) => quiz.id);
  const categoryList = quizCategoryMockData.filter((category) => quizIdList.includes(category.quiz_id));
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: categoryList
  };
};

export const mockSearchWordAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の単語を返す
  const searchResults = englishDataMock.words.slice(0, 3);

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetWordDetailAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishDataMock.wordDetail
  };
};

export const mockGetPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishDataMock.partOfSpeechList
  };
};

export const mockGetSourceListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishDataMock.sourceList
  };
};

export const mockSearchSayingAPI = async (params: any): Promise<ApiResult> => {
  const { searchSayingRequestData } = params;
  const searchQuery = searchSayingRequestData?.saying || '';

  // 検索クエリに基づいて格言をフィルタリング（部分一致）
  let filteredSayings = sayingMockData;
  if (searchQuery) {
    filteredSayings = sayingMockData.filter(
      (saying) => saying.saying.includes(searchQuery) || saying.explanation?.includes(searchQuery)
    );
  }

  // SearchSayingAPIResponseDtoの形式に変換（selfhelp_bookを含める）
  const searchResults = filteredSayings.slice(0, 10).map((saying) => {
    const book = selfhelpBookMockData.find((b) => b.id === saying.book_id);
    return {
      id: saying.id,
      saying: saying.saying,
      explanation: saying.explanation || '',
      selfhelp_book: {
        name: book?.name || '不明な本'
      }
    };
  });

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

// 認証関連のモック関数（常に成功を返す）
export const mockLoginAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00023,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }
  };
};

export const mockLogoutAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00024,
      messageColor: 'success.light',
      isDisplay: true
    }
    //result: null
  };
};

// その他のAPI関数も必要に応じて追加
export const mockAddQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00002,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      log: 'Added!! [1-999]:test,test',
      file_num: 1,
      quiz_num: 1,
      quiz_sentense: 'test',
      answer: 'test'
    }
  };
};

export const mockEditQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00018,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { result: 'Edited!' }
  };
};

export const mockDeleteQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: successMessage(
      MESSAGES.SUCCESS.MSG00009,
      String(params.deleteQuizAPIRequestData.file_num),
      String(params.deleteQuizAPIRequestData.quiz_num)
    )
  };
};

export const mockAddWordAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '単語を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999 }
  };
};

export const mockAddExampleAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '例文を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999 }
  };
};

export const mockGetImageOfQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '画像を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Sample+Quiz+Image'
    }
  };
};

export const mockGetSayingAPI = async (params: any): Promise<ApiResult> => {
  // ランダムな格言を返す
  const randomSaying = sayingMockData[Math.floor(Math.random() * sayingMockData.length)];

  return {
    message: {
      message: '格言を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: randomSaying
  };
};

export const mockClearQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00008.replace('{0}', String(params.getQuizResponseData.quiz_num)),
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockFailQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00011.replace('{0}', String(params.getQuizResponseData.quiz_num)),
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockReverseCheckQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00006.replace('{0}', String(params.getQuizResponseData.quiz_num)),
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockGetWordSummaryDataAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: '単語サマリーデータを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { name: 'vocabulary', count: 150 },
      { name: 'idiom', count: 200 }
    ] as WordSummaryApiResponse[]
  };
};

export const mockGetRandomWordAPI = async (): Promise<ApiResult> => {
  const randomWord = englishDataMock.words[Math.floor(Math.random() * englishDataMock.words.length)];
  return {
    message: {
      message: 'ランダム単語を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: randomWord
  };
};

export const mockGetWordTestStatisticsWeekDataAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '週間テスト統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 7 },
      { date: '2024-01-03', count: 6 },
      { date: '2024-01-04', count: 8 },
      { date: '2024-01-05', count: 9 },
      { date: '2024-01-06', count: 7 },
      { date: '2024-01-07', count: 8 }
    ]
  };
};

export const mockGetWordNumAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: '単語数を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      _max: {
        id: englishDataMock.words.length
      }
    }
  };
};

export const mockAddSayingAPI = async (params: any): Promise<ApiResult> => {
  const { addSayingAPIRequest } = params;

  if (!addSayingAPIRequest.book_id || addSayingAPIRequest.book_id === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00011)
    };
  }

  if (!addSayingAPIRequest.saying || addSayingAPIRequest.saying === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00012)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00016, addSayingAPIRequest.saying),
    result: { id: 999 }
  };
};

export const mockEditSayingAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '格言を更新しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddBookAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '啓発本を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999, name: params.addBookAPIRequest.book_name }
  };
};

export const mockListBookAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: '啓発本リストを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { id: 1, name: '7つの習慣' },
      { id: 2, name: '人を動かす' },
      { id: 3, name: '思考は現実化する' }
    ]
  };
};

export const mockGetQuizFileStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  const clearCount = getRandomIntWithRange(0, 50);
  const failCount = getRandomIntWithRange(0, 50);
  return {
    message: {
      message: '問題ファイル統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      file_num: params.file_num,
      file_nickname: quizFileMockData.find((file) => file.file_num === params.file_num)?.file_nickname || '全総合',
      count: 100,
      clear: clearCount,
      fail: failCount,
      not_answered: 100 - clearCount - failCount,
      process_rate: (clearCount / 100) * 100
    }
  };
};

export const mockGetAccuracyRateHistgramDataAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '正解率ヒストグラムデータを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      result: [
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100)
      ] // 0-90%の分布
    }
  };
};

export const mockGetAnswerLogStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '回答ログ統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result:
      params.getAnswerLogStatisticsData.date_unit === 'week'
        ? [
            { date: '2023-11-26', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-03', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-10', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-17', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-24', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-31', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2024-01-07', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
          ]
        : params.getAnswerLogStatisticsData.date_unit === 'month'
          ? [
              {
                date: '2023-07-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-08-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-09-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-10-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-11-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-12-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              { date: '2024-01-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
            ]
          : [
              {
                date: '2024-01-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-02',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-03',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-04',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-05',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-07',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              { date: '2024-01-07', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
            ]
  };
};

export const mockAddCategoryToQuizAPI = async (params: any): Promise<ApiResult> => {
  const { addCategoryToQuizRequestData } = params;

  if (!addCategoryToQuizRequestData.quiz_id || addCategoryToQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004),
    result: { id: 999 }
  };
};

export const mockDeleteCategoryOfQuizAPI = async (params: any): Promise<ApiResult> => {
  const { deleteCategoryToQuizRequestData } = params;

  if (!deleteCategoryToQuizRequestData.quiz_id || deleteCategoryToQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004),
    result: { id: 999 }
  };
};

export const mockCheckOnQuizAPI = async (params: any): Promise<ApiResult> => {
  const { checkQuizRequestData } = params;

  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00007)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00005),
    result: { id: 999 }
  };
};

export const mockCheckOffQuizAPI = async (params: any): Promise<ApiResult> => {
  const { checkQuizRequestData } = params;

  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00007)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00005),
    result: { id: 999 }
  };
};

export const mockIntegrateQuizAPI = async (params: any): Promise<ApiResult> => {
  const { integrateToQuizAPIRequestData } = params;

  if (!integrateToQuizAPIRequestData.fromQuizId || !integrateToQuizAPIRequestData.toQuizId) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00010)
    };
  }

  return {
    message: successMessage(
      MESSAGES.SUCCESS.MSG00014,
      'ID',
      String(integrateToQuizAPIRequestData.fromQuizId),
      String(integrateToQuizAPIRequestData.toQuizId)
    ),
    result: { id: 999 }
  };
};

export const mockGetAccuracyRateByCategoryAPI = async (params: any): Promise<ApiResult> => {
  const { getCategoryRateData } = params;

  if (getCategoryRateData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  // 指定されたファイルのカテゴリを取得
  const quizIdList = quizMockData
    .filter((quiz) => quiz.file_num === getCategoryRateData.file_num)
    .map((quiz) => quiz.id);
  const categories = quizCategoryMockData.filter((category) => quizIdList.includes(category.quiz_id));

  // カテゴリごとの正解率データを生成
  const result = categories.map((category) => ({
    file_num: getCategoryRateData.file_num,
    category: category.category || '',
    count: getRandomIntWithRange(10, 100),
    accuracy_rate: getRandomIntWithRange(0, 100)
  }));

  // チェック済み問題の正解率データ
  const checked_result = [
    {
      checked: true,
      count: BigInt(getRandomIntWithRange(5, 50)),
      sum_clear: getRandomIntWithRange(0, 30),
      sum_fail: getRandomIntWithRange(0, 20),
      accuracy_rate: getRandomIntWithRange(0, 100)
    }
  ];

  // 全問題の正解率データ
  const all_result = [
    {
      count: BigInt(getRandomIntWithRange(50, 200)),
      sum_clear: getRandomIntWithRange(20, 100),
      sum_fail: getRandomIntWithRange(10, 80),
      accuracy_rate: getRandomIntWithRange(0, 100)
    }
  ];

  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result: {
      result,
      checked_result,
      all_result
    }
  };
};

export const mockAddQuizFileAPI = async (params: any): Promise<ApiResult> => {
  const { addQuizFileApiRequest } = params;

  if (!addQuizFileApiRequest.file_nickname || addQuizFileApiRequest.file_nickname === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00004)
    };
  }

  // モックデータから次のfile_numを計算
  const maxFileNum = quizFileMockData.length > 0 ? Math.max(...quizFileMockData.map((file) => file.file_num)) : 0;
  const newFileNum = maxFileNum + 1;

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00012, String(addQuizFileApiRequest.file_nickname)),
    result: { file_num: newFileNum }
  };
};

export const mockDeleteQuizFileAPI = async (params: any): Promise<ApiResult> => {
  const { deleteQuizFileApiRequest } = params;

  if (!deleteQuizFileApiRequest.file_id || deleteQuizFileApiRequest.file_id === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00004)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00013, String(deleteQuizFileApiRequest.file_id)),
    result: { result: 'Deleted.' }
  };
};

export const mockDeleteAnswerLogOfQuizFileAPI = async (params: any): Promise<ApiResult> => {
  const { deleteLogOfFileRequest } = params;

  if (!deleteLogOfFileRequest.file_id || deleteLogOfFileRequest.file_id === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00004)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00003, String(deleteLogOfFileRequest.file_id)),
    result: { result: 'Deleted.' }
  };
};

export const mockDownloadQuizCsvAPI = async (params: any): Promise<ApiResult> => {
  const { downloadQuizCsvApiRequest } = params;

  if (!downloadQuizCsvApiRequest.file_num || downloadQuizCsvApiRequest.file_num === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  // モックモードではCSVファイルをダウンロードしない
  // 代わりに成功メッセージを返す
  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00022),
    result: {}
  };
};

export const mockGetSourceStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  // モックデータから出典統計データを生成
  const sourceList = englishDataMock.sourceList || [];
  const result = sourceList.map((source: any) => ({
    id: source.id || 1,
    name: source.name || 'Unknown',
    clear_count: getRandomIntWithRange(0, 100),
    fail_count: getRandomIntWithRange(0, 50),
    count: getRandomIntWithRange(50, 200),
    not_answered: getRandomIntWithRange(0, 50),
    accuracy_rate: getRandomIntWithRange(0, 100)
  }));

  return {
    message: {
      message: MESSAGES.DEFAULT.MSG00001,
      messageColor: 'common.black',
      isDisplay: false
    },
    result
  };
};

export const mockGetEnglishWordTestDataAPI = async (params: any): Promise<ApiResult> => {
  const { getEnglishWordTestData } = params;

  // モックデータからランダムな単語を取得
  const randomWord = englishDataMock.words[Math.floor(Math.random() * englishDataMock.words.length)];

  if (!randomWord) {
    return {
      message: {
        message: 'エラー:条件に合致するデータはありません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  // 四択問題のダミー選択肢を生成
  const dummyChoices = englishDataMock.words
    .filter((w) => w.id !== randomWord.id)
    .slice(0, 3)
    .map((w) => ({
      mean: w.mean[0]?.meaning || 'dummy meaning'
    }));

  const result = {
    word: {
      id: randomWord.id,
      name: randomWord.name || '',
      checked: false,
      mean: randomWord.mean.map((m, index) => ({
        id: index + 1,
        word_id: randomWord.id,
        wordmean_id: index + 1,
        meaning: m.meaning || '',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        partsofspeech: {
          id: 1,
          name: m.partsofspeech?.name || 'noun'
        }
      })),
      word_source: randomWord.word_source.map((ws, index) => ({
        source: {
          id: index + 1,
          name: ws.source?.name || 'Unknown'
        }
      })),
      word_statistics_view: {
        accuracy_rate: String(getRandomIntWithRange(0, 100))
      }
    },
    correct: {
      mean: randomWord.mean[0]?.meaning || ''
    },
    dummy: dummyChoices,
    testType: getEnglishWordTestData?.format === 'random' ? '0' : '1'
  };

  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result
  };
};

export const mockSubmitEnglishBotTestAPI = async (params: any): Promise<ApiResult> => {
  const { selectedValue } = params;

  if (selectedValue === undefined) {
    return {
      message: {
        message: 'エラー:解答が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: `${selectedValue ? '正解+1!' : '不正解+1..'} 登録しました`,
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockToggleWordCheckAPI = async (params: any): Promise<ApiResult> => {
  const { toggleCheckData } = params;

  if (!toggleCheckData.wordId || toggleCheckData.wordId === -1) {
    return {
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!編集に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockSearchExampleAPI = async (params: any): Promise<ApiResult> => {
  const { searchExampleData } = params;

  if (!searchExampleData.query || searchExampleData.query === '') {
    return {
      message: {
        message: 'エラー:検索語句を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  // モックデータから例文を検索
  const searchResults = englishDataMock.examples
    ? englishDataMock.examples
        .filter((example) => {
          if (searchExampleData.isLinked) {
            // 紐付いている例文を検索（wordNameは型定義に存在しないため、常にfalseを返す）
            return false;
          } else {
            // 紐付いていない例文を検索
            return (
              example.en_example_sentense?.includes(searchExampleData.query) ||
              example.ja_example_sentense?.includes(searchExampleData.query)
            );
          }
        })
        .slice(0, 10)
        .map((example, index) => ({
          id: example.id || index + 1,
          en_example_sentense: example.en_example_sentense || '',
          ja_example_sentense: example.ja_example_sentense || ''
        }))
    : [];

  if (searchResults.length === 0) {
    return {
      message: {
        message: 'エラー:条件に合うデータはありません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockSubmitAssociationExampleAPI = async (params: any): Promise<ApiResult> => {
  const { submitAssociationExampleData } = params;

  if (!submitAssociationExampleData.wordName || submitAssociationExampleData.wordName === '') {
    return {
      message: {
        message: 'エラー:単語が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  if (!submitAssociationExampleData.checkedIdList || submitAssociationExampleData.checkedIdList.length === 0) {
    return {
      message: {
        message: 'エラー:チェックしたIDリストがありません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: '処理が終了しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddSynonymAPI = async (params: any): Promise<ApiResult> => {
  const { addSynonymData } = params;

  if (!addSynonymData.synonymWordName || addSynonymData.synonymWordName === '') {
    return {
      message: {
        message: 'エラー:類義語が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!追加に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockEditEnglishWordSourceAPI = async (params: any): Promise<ApiResult> => {
  const { editWordSourceData } = params;

  if (editWordSourceData.newSourceId === -1) {
    return {
      message: {
        message: 'エラー:出典を選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!編集に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockDeleteEnglishWordSourceAPI = async (params: any): Promise<ApiResult> => {
  const { deleteWordSourceData } = params;

  if (!deleteWordSourceData.word_id || !deleteWordSourceData.source_id) {
    return {
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!削除に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockEditEnglishWordSubSourceAPI = async (params: any): Promise<ApiResult> => {
  const { editWordSubSourceData } = params;

  if (!editWordSubSourceData.subSource || editWordSubSourceData.subSource === '') {
    return {
      message: {
        message: 'エラー:サブ出典を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!編集に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockDeleteEnglishWordSubSourceAPI = async (params: any): Promise<ApiResult> => {
  const { deleteWordSubSourceData } = params;

  if (!deleteWordSubSourceData.id || deleteWordSubSourceData.id === -1) {
    return {
      message: {
        message: 'エラー:サブ出典を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!削除に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockEditEnglishWordMeanAPI = async (params: any): Promise<ApiResult> => {
  const { editMeanData } = params;

  if (editMeanData.partofspeechId === -1) {
    return {
      message: {
        message: 'エラー:品詞を選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!編集に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockDeleteEnglishMeanAPI = async (params: any): Promise<ApiResult> => {
  const { deleteMeanData } = params;

  if (!deleteMeanData.meanId || deleteMeanData.meanId === -1) {
    return {
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!削除に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockLinkWordEtymologyAPI = async (params: any): Promise<ApiResult> => {
  const { linkWordEtymologyData } = params;

  if (!linkWordEtymologyData.etymologyName || linkWordEtymologyData.etymologyName === '') {
    return {
      message: {
        message: 'エラー:語源名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  if (linkWordEtymologyData.wordId === -1) {
    return {
      message: {
        message: 'エラー:追加する単語IDを入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!追加に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddEtymologyAPI = async (params: any): Promise<ApiResult> => {
  const { addEtymologyData } = params;

  if (!addEtymologyData.etymologyName || addEtymologyData.etymologyName === '') {
    return {
      message: {
        message: 'エラー:語源名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!追加に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddDerivativeAPI = async (params: any): Promise<ApiResult> => {
  const { addDerivativeData } = params;

  if (!addDerivativeData.wordName || addDerivativeData.wordName === '') {
    return {
      message: {
        message: 'エラー:元単語名が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  if (!addDerivativeData.derivativeName || addDerivativeData.derivativeName === '') {
    return {
      message: {
        message: 'エラー:追加する単語名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!追加に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddAntonymAPI = async (params: any): Promise<ApiResult> => {
  const { addAntonymData } = params;

  if (!addAntonymData.antonymWordName || addAntonymData.antonymWordName === '') {
    return {
      message: {
        message: 'エラー:対義語が入力されていません',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  return {
    message: {
      message: 'Success!!追加に成功しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

// Todo関連のモックデータ（メモリ上で管理）
let todoMockData: Array<{ id: number; todo: string }> = [
  { id: 1, todo: 'APIラッパーの実装を完了する' },
  { id: 2, todo: 'モックデータの追加を完了する' },
  { id: 3, todo: 'テストケースの作成' },
  { id: 4, todo: 'ドキュメントの更新' }
];
// 削除済みTodo（復元可能な状態で保持）
let deletedTodoMockData: Array<{ id: number; todo: string; deleted_at: string }> = [];

export const mockAddTodoAPI = async (params: any): Promise<ApiResult> => {
  const { addTodoAPIRequest } = params;

  if (!addTodoAPIRequest.todo || addTodoAPIRequest.todo === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  // 新しいIDを生成
  const newId = todoMockData.length > 0 ? Math.max(...todoMockData.map((t) => t.id)) + 1 : 1;
  const newTodo = { id: newId, todo: addTodoAPIRequest.todo };
  // 新しい配列を作成して再代入（pushではなく）
  todoMockData = [...todoMockData, newTodo];

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00025, newTodo.todo),
    result: newTodo
  };
};

export const mockDeleteTodoAPI = async (params: any): Promise<ApiResult> => {
  const { deleteTodoAPIRequestData } = params;

  if (!deleteTodoAPIRequestData.id || deleteTodoAPIRequestData.id === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const todoIndex = todoMockData.findIndex((t) => t.id === deleteTodoAPIRequestData.id);
  if (todoIndex === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00004)
    };
  }

  const deletedTodo = todoMockData[todoIndex];
  // 新しい配列を作成して再代入
  todoMockData = todoMockData.filter((t) => t.id !== deleteTodoAPIRequestData.id);
  // 復元できるよう削除済みリストへ退避
  deletedTodoMockData = [...deletedTodoMockData, { ...deletedTodo, deleted_at: new Date().toISOString() }];

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00009, String(deletedTodo.id)),
    result: { id: deletedTodo.id, todo: deletedTodo.todo }
  };
};

export const mockGetTodoListAllAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [...todoMockData, ...deletedTodoMockData]
  };
};

export const mockRestoreTodoAPI = async (params: any): Promise<ApiResult> => {
  const { restoreTodoAPIRequestData } = params;

  if (!restoreTodoAPIRequestData.id || restoreTodoAPIRequestData.id === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const deletedIndex = deletedTodoMockData.findIndex((t) => t.id === restoreTodoAPIRequestData.id);
  if (deletedIndex === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00004)
    };
  }

  const restoredTodo = deletedTodoMockData[deletedIndex];
  deletedTodoMockData = deletedTodoMockData.filter((t) => t.id !== restoreTodoAPIRequestData.id);
  todoMockData = [...todoMockData, { id: restoredTodo.id, todo: restoredTodo.todo }];

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00018),
    result: { id: restoredTodo.id, todo: restoredTodo.todo, deleted_at: null }
  };
};

export const mockGetTodoListAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: todoMockData
  };
};

// Todo日記のモックデータ（日付ごとに管理）
const todoDiaryMockData: Record<string, { date: string; completed: boolean }[]> = {};

export const mockAddTodoDiaryAPI = async (params: any): Promise<ApiResult> => {
  const { addTodoDiaryAPIRequest } = params;

  if (!addTodoDiaryAPIRequest.date || !addTodoDiaryAPIRequest.todo_id) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const date = addTodoDiaryAPIRequest.date;
  if (!todoDiaryMockData[date]) {
    todoDiaryMockData[date] = [];
  }

  todoDiaryMockData[date].push({
    date: date,
    completed: addTodoDiaryAPIRequest.completed || false
  });

  return {
    message: {
      message: `Todo日記を追加しました（日付: ${date}）`,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { date: date }
  };
};

// Todoチェック状態のモックデータ（日付ごとに管理）
const todoCheckStatusMockData: Record<string, number[]> = {};

export const mockGetTodoCheckStatusAPI = async (params: any): Promise<ApiResult> => {
  const { getTodoCheckStatusAPIRequest } = params;

  if (!getTodoCheckStatusAPIRequest.date) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const date = getTodoCheckStatusAPIRequest.date;
  const completedTodoIds = todoCheckStatusMockData[date] || [];

  return {
    message: {
      message: 'Todoチェック状態を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { completedTodoIds }
  };
};

export const mockSaveTodoCheckStatusAPI = async (params: any): Promise<ApiResult> => {
  const { saveTodoCheckStatusAPIRequest } = params;

  if (!saveTodoCheckStatusAPIRequest.date) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const date = saveTodoCheckStatusAPIRequest.date;
  todoCheckStatusMockData[date] = saveTodoCheckStatusAPIRequest.completedTodoIds || [];

  return {
    message: {
      message: 'Todoチェック状態を保存しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { date: date, completedTodoIds: todoCheckStatusMockData[date] }
  };
};

// 例文テスト関連のモック
export const mockGetExampleTestDataAPI = async (params: any): Promise<ApiResult> => {
  const candidates = englishExamplesMockData;

  if (candidates.length === 0) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00003)
    };
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result: {
      total: candidates.length,
      example: {
        id: picked.id,
        en_example_sentense: picked.en_example_sentense,
        ja_example_sentense: picked.ja_example_sentense,
        example_explanation: [{ explanation: `「${picked.ja_example_sentense}」という意味の例文です。` }]
      }
    },
    total: candidates.length
  };
};

export const mockSubmitExampleTestDataAPI = async (params: any): Promise<ApiResult> => {
  const { selectedValue } = params;

  if (selectedValue === undefined) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  return {
    message: successMessage(selectedValue ? '正解として登録しました' : '不正解として登録しました')
  };
};

// カテゴリ親子関係のモックデータ（メモリ上で管理）
let categoryParentChildMockData: CategoryParentChildAPIResponseDto[] = [
  { id: 1, parent_category_id: 100, parent_category_name: 'AWS', child_category_id: 101, child_category_name: 'コンピューティング' },
  { id: 2, parent_category_id: 100, parent_category_name: 'AWS', child_category_id: 102, child_category_name: 'ストレージ' },
  { id: 3, parent_category_id: 100, parent_category_name: 'AWS', child_category_id: 103, child_category_name: 'ネットワーク' },
  { id: 4, parent_category_id: 200, parent_category_name: 'データベース', child_category_id: 201, child_category_name: '正規化' },
  { id: 5, parent_category_id: 200, parent_category_name: 'データベース', child_category_id: 202, child_category_name: 'SQL' }
];

export const mockGetCategoryParentChildListAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result: categoryParentChildMockData
  };
};

export const mockAddCategoryParentChildAPI = async (params: any): Promise<ApiResult> => {
  const { addCategoryParentChildData } = params;

  if (!addCategoryParentChildData?.parent_category || !addCategoryParentChildData?.child_category) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const newId =
    categoryParentChildMockData.length > 0 ? Math.max(...categoryParentChildMockData.map((x) => x.id)) + 1 : 1;
  categoryParentChildMockData = [
    ...categoryParentChildMockData,
    {
      id: newId,
      parent_category_id: newId * 1000,
      parent_category_name: addCategoryParentChildData.parent_category,
      child_category_id: newId * 1000 + 1,
      child_category_name: addCategoryParentChildData.child_category
    }
  ];

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004)
  };
};

export const mockDeleteCategoryParentChildAPI = async (params: any): Promise<ApiResult> => {
  const { deleteCategoryParentChildData } = params;

  categoryParentChildMockData = categoryParentChildMockData.filter((x) => x.id !== deleteCategoryParentChildData?.id);

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004)
  };
};

// カテゴリ別問題数のモックデータ（上記の親子関係と同じidで対応させ、ツリーマップが意味のある形になるようにしている）
const categoryQuizCountMockData: CategoryQuizCountDto[] = [
  { id: 100, name: 'AWS', count: 20 },
  { id: 101, name: 'コンピューティング', count: 8 },
  { id: 102, name: 'ストレージ', count: 7 },
  { id: 103, name: 'ネットワーク', count: 5 },
  { id: 200, name: 'データベース', count: 12 },
  { id: 201, name: '正規化', count: 5 },
  { id: 202, name: 'SQL', count: 4 },
  { id: 300, name: 'JavaScript', count: 6 }
];

export const mockGetCategoryQuizCountAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result: categoryQuizCountMockData
  };
};

export const mockCleanupEmptyCategoriesAPI = async (): Promise<ApiResult> => {
  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004),
    result: { deleted_count: 0 }
  };
};

export const mockGetRecommendedCategoriesAPI = async (params: { file_num: number }): Promise<ApiResult> => {
  if (params.file_num === -1) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  const result: RecommendedCategoryDto[] = [
    { category_name: 'ネットワーク', reason: 'neverAnswered', days_since_last_answered: null, recent_accuracy_rate: null },
    { category_name: '正規化', reason: 'notRecent', days_since_last_answered: 14, recent_accuracy_rate: null },
    { category_name: 'SQL', reason: 'lowAccuracy', days_since_last_answered: null, recent_accuracy_rate: 0.35 }
  ];

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00019),
    result
  };
};
