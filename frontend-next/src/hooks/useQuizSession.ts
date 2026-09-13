import { useCallback, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetQuizAPIRequestDto, GetQuizApiResponseDto, initGetQuizResponseData } from 'quizzer-lib';
import { getQuizAPI, clearQuizAPI, failQuizAPI } from '@/utils/api-wrapper';
import { initialQuizSessionState, quizSessionReducer } from './quizSession/reducer';

export type QuizSessionMethod = 'random' | 'worstRate' | 'leastClear' | 'LRU' | 'review' | 'todayNotAnswered';

export interface StartQuizSessionParams {
  getQuizRequestData: GetQuizAPIRequestDto;
  getQuizMethod: QuizSessionMethod;
  count: number;
}

// 出題設定の条件・出題形式・出題数からN問取得し、1問ずつ出題〜正解不正解登録〜次の問題へ進めるセッションを管理するフック
export const useQuizSession = () => {
  const [state, dispatch] = useReducer(quizSessionReducer, initialQuizSessionState);
  const setMessage = useSetRecoilState(messageState);

  // 出題設定の内容を元に条件に合う問題をcount件取得し、出題を開始する
  const startSession = useCallback(
    async ({ getQuizRequestData, getQuizMethod, count }: StartQuizSessionParams): Promise<GetQuizApiResponseDto[]> => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await getQuizAPI({
        getQuizRequestData: { ...getQuizRequestData, count },
        getQuizMethod
      });
      setMessage(result.message);
      const quizzes = Array.isArray(result.result) ? (result.result as GetQuizApiResponseDto[]) : [];
      dispatch({ type: 'START', queue: quizzes });
      return quizzes;
    },
    [setMessage]
  );

  // 現在の問題に解答する。登録が成功したらセッションを次の問題に進める（キューの最後なら終了状態にする）
  const answer = useCallback(
    async (isCorrect: boolean) => {
      const currentQuiz = state.queue[state.currentIndex];
      if (!currentQuiz || state.status !== 'active') {
        return;
      }
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = isCorrect
        ? await clearQuizAPI({ getQuizResponseData: currentQuiz })
        : await failQuizAPI({ getQuizResponseData: currentQuiz });
      setMessage(result.message);
      // TODO 成功時の判定法（DisplayQuizSectionの既存実装と同様のmessageColorでの判定）
      if (result.message.messageColor === 'success.light') {
        dispatch({ type: 'ANSWER', isCorrect });
      }
    },
    [state.queue, state.currentIndex, state.status, setMessage]
  );

  // 出題設定に戻るためセッションを初期状態にリセットする
  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    status: state.status,
    currentQuiz: state.queue[state.currentIndex] ?? initGetQuizResponseData,
    currentIndex: state.currentIndex,
    totalCount: state.queue.length,
    correctCount: state.correctCount,
    answeredCount: state.answeredCount,
    startSession,
    answer,
    resetSession
  };
};
