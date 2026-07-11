import { ApiResult } from 'quizzer-lib';
import * as mockAPI from './mock-api';

// モックモードかどうかを判定する関数
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
};

// API関数のラッパー関数群
export const getQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // ※モック時ではカテゴリ、正解率による出題は実装していない。 (TODO 直す？)
    console.log('getQuizAPI'); // TODO これ消すとlocalhost時のIntegrateでブラウザが壊れる？
    return mockAPI.mockGetQuizAPI(params);
  }

  // 本番環境では元のAPIを呼び出す
  const { getQuizAPI: originalGetQuizAPI } = await import('quizzer-lib');
  return originalGetQuizAPI(params);
};

export const searchQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchQuizAPI(params);
  }

  const { searchQuizAPI: originalSearchQuizAPI } = await import('quizzer-lib');
  return originalSearchQuizAPI(params);
};

export const getQuizFileListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFileListAPI();
  }

  const { getQuizFileListAPI: originalGetQuizFileListAPI } = await import('quizzer-lib');
  return originalGetQuizFileListAPI();
};

export const getQuizFormatListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFormatListAPI();
  }

  const { getQuizFormatListAPI: originalGetQuizFormatListAPI } = await import('quizzer-lib');
  return originalGetQuizFormatListAPI();
};

export const getCategoryListAPI = async (p0: { getCategoryListData: { file_num: string } }): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetCategoryListAPI(p0.getCategoryListData.file_num);
  }

  const { getCategoryListAPI: originalGetCategoryListAPI } = await import('quizzer-lib');
  return originalGetCategoryListAPI({ getCategoryListData: { file_num: p0.getCategoryListData.file_num } });
};

export const searchWordAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchWordAPI(params);
  }

  const { searchWordAPI: originalSearchWordAPI } = await import('quizzer-lib');
  return originalSearchWordAPI(params);
};

export const getWordDetailAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordDetailAPI(params);
  }

  const { getWordDetailAPI: originalGetWordDetailAPI } = await import('quizzer-lib');
  return originalGetWordDetailAPI(params);
};

export const getPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetPartOfSpeechListAPI();
  }

  const { getPartOfSpeechListAPI: originalGetPartOfSpeechListAPI } = await import('quizzer-lib');
  return originalGetPartOfSpeechListAPI();
};

export const getSourceListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetSourceListAPI();
  }

  const { getSourceListAPI: originalGetSourceListAPI } = await import('quizzer-lib');
  return originalGetSourceListAPI();
};

export const searchSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchSayingAPI(params);
  }

  const { searchSayingAPI: originalSearchSayingAPI } = await import('quizzer-lib');
  return originalSearchSayingAPI(params);
};

export const loginAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockLoginAPI(params);
  }

  const { authSigninAPI: originalLoginAPI } = await import('quizzer-lib');
  return originalLoginAPI(params);
};

// export const logoutAPI = async (): Promise<ApiResult> => {
//   if (isMockMode()) {
//     return mockAPI.mockLogoutAPI();
//   }

//   const { logoutAPI: originalLogoutAPI } = await import('quizzer-lib');
//   return originalLogoutAPI();
// };

export const addQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddQuizAPI(params);
  }

  const { addQuizAPI: originalAddQuizAPI } = await import('quizzer-lib');
  return originalAddQuizAPI(params);
};

export const editQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditQuizAPI(params);
  }

  const { editQuizAPI: originalEditQuizAPI } = await import('quizzer-lib');
  return originalEditQuizAPI(params);
};

export const deleteQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteQuizAPI(params);
  }

  const { deleteQuiz: originalDeleteQuizAPI } = await import('quizzer-lib');
  return originalDeleteQuizAPI(params);
};

export const addWordAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddWordAPI(params);
  }

  const { addWordAPI: originalAddWordAPI } = await import('quizzer-lib');
  return originalAddWordAPI(params);
};

export const addExampleAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddExampleAPI(params);
  }

  const { submitExampleSentenseAPI: originalAddExampleAPI } = await import('quizzer-lib');
  return originalAddExampleAPI(params);
};

export const getImageOfQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetImageOfQuizAPI(params);
  }

  const { getImageOfQuizAPI: originalGetImageOfQuizAPI } = await import('quizzer-lib');
  return originalGetImageOfQuizAPI(params);
};

export const getSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetSayingAPI(params);
  }

  const { getSayingAPI: originalGetSayingAPI } = await import('quizzer-lib');
  return originalGetSayingAPI(params);
};

export const addSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddSayingAPI(params);
  }

  const { addSayingAPI: originalAddSayingAPI } = await import('quizzer-lib');
  return originalAddSayingAPI(params);
};

export const clearQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockClearQuizAPI(params);
  }

  const { clearQuizAPI: originalClearQuizAPI } = await import('quizzer-lib');
  return originalClearQuizAPI(params);
};

export const failQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockFailQuizAPI(params);
  }

  const { failQuizAPI: originalFailQuizAPI } = await import('quizzer-lib');
  return originalFailQuizAPI(params);
};

export const reverseCheckQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockReverseCheckQuizAPI(params);
  }

  const { reverseCheckQuizAPI: originalReverseCheckQuizAPI } = await import('quizzer-lib');
  return originalReverseCheckQuizAPI(params);
};

export const getWordSummaryDataAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordSummaryDataAPI();
  }

  const { getWordSummaryDataAPI: originalGetWordSummaryDataAPI } = await import('quizzer-lib');
  return originalGetWordSummaryDataAPI();
};

export const getRandomWordAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetRandomWordAPI();
  }

  const { getRandomWordAPI: originalGetRandomWordAPI } = await import('quizzer-lib');
  return originalGetRandomWordAPI();
};

export const getWordNumAPI = async (params?: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordNumAPI();
  }

  const { getWordNumAPI: originalGetWordNumAPI } = await import('quizzer-lib');
  return originalGetWordNumAPI(params || {});
};

export const getWordTestStatisticsWeekDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordTestStatisticsWeekDataAPI(params);
  }

  const { getWordTestStatisticsWeekDataAPI: originalGetWordTestStatisticsWeekDataAPI } = await import('quizzer-lib');
  return originalGetWordTestStatisticsWeekDataAPI(params);
};

export const editSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditSayingAPI(params);
  }

  const { editSayingAPI: originalEditSayingAPI } = await import('quizzer-lib');
  return originalEditSayingAPI(params);
};

export const addBookAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddBookAPI(params);
  }

  const { addBookAPI: originalAddBookAPI } = await import('quizzer-lib');
  return originalAddBookAPI(params);
};

export const listBookAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockListBookAPI();
  }

  const { listBook: originalListBookAPI } = await import('quizzer-lib');
  return originalListBookAPI();
};

export const getQuizFileStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFileStatisticsDataAPI(params);
  }

  const { getQuizFileStatisticsDataAPI: originalGetQuizFileStatisticsDataAPI } = await import('quizzer-lib');
  return originalGetQuizFileStatisticsDataAPI(params);
};

export const getAccuracyRateHistgramDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAccuracyRateHistgramDataAPI(params);
  }

  const { getAccuracyRateHistgramDataAPI: originalGetAccuracyRateHistgramDataAPI } = await import('quizzer-lib');
  return originalGetAccuracyRateHistgramDataAPI(params);
};

export const getAnswerLogStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAnswerLogStatisticsDataAPI(params);
  }

  const { getAnswerLogStatisticsDataAPI: originalGetAnswerLogStatisticsDataAPI } = await import('quizzer-lib');
  return originalGetAnswerLogStatisticsDataAPI(params);
};

export const addCategoryToQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddCategoryToQuizAPI(params);
  }

  const { addCategoryToQuizAPI: originalAddCategoryToQuizAPI } = await import('quizzer-lib');
  return originalAddCategoryToQuizAPI(params);
};

export const deleteCategoryOfQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteCategoryOfQuizAPI(params);
  }

  const { deleteCategoryOfQuizAPI: originalDeleteCategoryOfQuizAPI } = await import('quizzer-lib');
  return originalDeleteCategoryOfQuizAPI(params);
};

export const checkOnQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockCheckOnQuizAPI(params);
  }

  const { checkOnQuizAPI: originalCheckOnQuizAPI } = await import('quizzer-lib');
  return originalCheckOnQuizAPI(params);
};

export const checkOffQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockCheckOffQuizAPI(params);
  }

  const { checkOffQuizAPI: originalCheckOffQuizAPI } = await import('quizzer-lib');
  return originalCheckOffQuizAPI(params);
};

export const integrateQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockIntegrateQuizAPI(params);
  }

  const { integrateQuizAPI: originalIntegrateQuizAPI } = await import('quizzer-lib');
  return originalIntegrateQuizAPI(params);
};

export const getAccuracyRateByCategoryAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAccuracyRateByCategoryAPI(params);
  }

  const { getAccuracyRateByCategoryAPI: originalGetAccuracyRateByCategoryAPI } = await import('quizzer-lib');
  return originalGetAccuracyRateByCategoryAPI(params);
};

export const addQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddQuizFileAPI(params);
  }

  const { addQuizFileAPI: originalAddQuizFileAPI } = await import('quizzer-lib');
  return originalAddQuizFileAPI(params);
};

export const deleteQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteQuizFileAPI(params);
  }

  const { deleteQuizFileAPI: originalDeleteQuizFileAPI } = await import('quizzer-lib');
  return originalDeleteQuizFileAPI(params);
};

export const deleteAnswerLogOfQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteAnswerLogOfQuizFileAPI(params);
  }

  const { deleteAnswerLogOfQuizFileAPI: originalDeleteAnswerLogOfQuizFileAPI } = await import('quizzer-lib');
  return originalDeleteAnswerLogOfQuizFileAPI(params);
};

export const downloadQuizCsvAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDownloadQuizCsvAPI(params);
  }

  const { downloadQuizCsvAPI: originalDownloadQuizCsvAPI } = await import('quizzer-lib');
  return originalDownloadQuizCsvAPI(params);
};

export const getSourceStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetSourceStatisticsDataAPI(params);
  }

  const { getSourceStatisticsDataAPI: originalGetSourceStatisticsDataAPI } = await import('quizzer-lib');
  return originalGetSourceStatisticsDataAPI(params);
};

export const getEnglishWordTestDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetEnglishWordTestDataAPI(params);
  }

  const { getEnglishWordTestDataAPI: originalGetEnglishWordTestDataAPI } = await import('quizzer-lib');
  return originalGetEnglishWordTestDataAPI(params);
};

export const submitEnglishBotTestAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSubmitEnglishBotTestAPI(params);
  }

  const { submitEnglishBotTestAPI: originalSubmitEnglishBotTestAPI } = await import('quizzer-lib');
  return originalSubmitEnglishBotTestAPI(params);
};

export const toggleWordCheckAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockToggleWordCheckAPI(params);
  }

  const { toggleWordCheckAPI: originalToggleWordCheckAPI } = await import('quizzer-lib');
  return originalToggleWordCheckAPI(params);
};

export const searchExampleAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchExampleAPI(params);
  }

  const { searchExampleAPI: originalSearchExampleAPI } = await import('quizzer-lib');
  return originalSearchExampleAPI(params);
};

export const getExampleTestDataAPI = async (params: any): Promise<ApiResult> => {
  const { getExampleTestDataAPI: originalGetExampleTestDataAPI } = await import('quizzer-lib');
  return originalGetExampleTestDataAPI(params);
};

export const submitExampleTestDataAPI = async (params: any): Promise<ApiResult> => {
  const { submitExampleTestDataAPI: originalSubmitExampleTestDataAPI } = await import('quizzer-lib');
  return originalSubmitExampleTestDataAPI(params);
};

export const submitAssociationExampleAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSubmitAssociationExampleAPI(params);
  }

  const { submitAssociationExampleAPI: originalSubmitAssociationExampleAPI } = await import('quizzer-lib');
  return originalSubmitAssociationExampleAPI(params);
};

export const addSynonymAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddSynonymAPI(params);
  }

  const { addSynonymAPI: originalAddSynonymAPI } = await import('quizzer-lib');
  return originalAddSynonymAPI(params);
};

export const editEnglishWordSourceAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditEnglishWordSourceAPI(params);
  }

  const { editEnglishWordSourceAPI: originalEditEnglishWordSourceAPI } = await import('quizzer-lib');
  return originalEditEnglishWordSourceAPI(params);
};

export const deleteEnglishWordSourceAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteEnglishWordSourceAPI(params);
  }

  const { deleteEnglishWordSourceAPI: originalDeleteEnglishWordSourceAPI } = await import('quizzer-lib');
  return originalDeleteEnglishWordSourceAPI(params);
};

export const editEnglishWordSubSourceAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditEnglishWordSubSourceAPI(params);
  }

  const { editEnglishWordSubSourceAPI: originalEditEnglishWordSubSourceAPI } = await import('quizzer-lib');
  return originalEditEnglishWordSubSourceAPI(params);
};

export const deleteEnglishWordSubSourceAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteEnglishWordSubSourceAPI(params);
  }

  const { deleteEnglishWordSubSourceAPI: originalDeleteEnglishWordSubSourceAPI } = await import('quizzer-lib');
  return originalDeleteEnglishWordSubSourceAPI(params);
};

export const editEnglishWordMeanAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditEnglishWordMeanAPI(params);
  }

  const { editEnglishWordMeanAPI: originalEditEnglishWordMeanAPI } = await import('quizzer-lib');
  return originalEditEnglishWordMeanAPI(params);
};

export const deleteEnglishMeanAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteEnglishMeanAPI(params);
  }

  const { deleteEnglishMeanAPI: originalDeleteEnglishMeanAPI } = await import('quizzer-lib');
  return originalDeleteEnglishMeanAPI(params);
};

export const linkWordEtymologyAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockLinkWordEtymologyAPI(params);
  }

  const { linkWordEtymologyAPI: originalLinkWordEtymologyAPI } = await import('quizzer-lib');
  return originalLinkWordEtymologyAPI(params);
};

export const addEtymologyAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddEtymologyAPI(params);
  }

  const { addEtymologyAPI: originalAddEtymologyAPI } = await import('quizzer-lib');
  return originalAddEtymologyAPI(params);
};

export const addDerivativeAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddDerivativeAPI(params);
  }

  const { addDerivativeAPI: originalAddDerivativeAPI } = await import('quizzer-lib');
  return originalAddDerivativeAPI(params);
};

export const addAntonymAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddAntonymAPI(params);
  }

  const { addAntonymAPI: originalAddAntonymAPI } = await import('quizzer-lib');
  return originalAddAntonymAPI(params);
};

export const addTodoAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddTodoAPI(params);
  }

  const { addTodoAPI: originalAddTodoAPI } = await import('quizzer-lib');
  return originalAddTodoAPI(params);
};

export const deleteTodoAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteTodoAPI(params);
  }

  const { deleteTodoAPI: originalDeleteTodoAPI } = await import('quizzer-lib');
  return originalDeleteTodoAPI(params);
};

export const getTodoListAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetTodoListAPI(params);
  }

  const { getTodoListAPI: originalGetTodoListAPI } = await import('quizzer-lib');
  return originalGetTodoListAPI(params);
};

export const getTodoListAllAPI = async (): Promise<ApiResult> => {
  const { getTodoListAllAPI: originalGetTodoListAllAPI } = await import('quizzer-lib');
  return originalGetTodoListAllAPI();
};

export const restoreTodoAPI = async (params: any): Promise<ApiResult> => {
  const { restoreTodoAPI: originalRestoreTodoAPI } = await import('quizzer-lib');
  return originalRestoreTodoAPI(params);
};

export const addTodoDiaryAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddTodoDiaryAPI(params);
  }

  const { addTodoDiaryAPI: originalAddTodoDiaryAPI } = await import('quizzer-lib');
  return originalAddTodoDiaryAPI(params);
};

export const getTodoCheckStatusAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetTodoCheckStatusAPI(params);
  }

  const { getTodoCheckStatusAPI: originalGetTodoCheckStatusAPI } = await import('quizzer-lib');
  return originalGetTodoCheckStatusAPI(params);
};

export const saveTodoCheckStatusAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSaveTodoCheckStatusAPI(params);
  }

  const { saveTodoCheckStatusAPI: originalSaveTodoCheckStatusAPI } = await import('quizzer-lib');
  return originalSaveTodoCheckStatusAPI(params);
};

export const getCategoryParentChildListAPI = async (params: any): Promise<ApiResult> => {
  const { getCategoryParentChildListAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI(params);
};

export const addCategoryParentChildAPI = async (params: any): Promise<ApiResult> => {
  const { addCategoryParentChildAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI(params);
};

export const deleteCategoryParentChildAPI = async (params: any): Promise<ApiResult> => {
  const { deleteCategoryParentChildAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI(params);
};

export const cleanupEmptyCategoriesAPI = async (): Promise<ApiResult> => {
  const { cleanupEmptyCategoriesAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI();
};

export const getCategoryQuizCountAPI = async (params: any): Promise<ApiResult> => {
  const { getCategoryQuizCountAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI(params);
};

export const getRecommendedCategoriesAPI = async (params: { file_num: number }): Promise<ApiResult> => {
  const { getRecommendedCategoriesAPI: originalAPI } = await import('quizzer-lib');
  return originalAPI(params);
};
