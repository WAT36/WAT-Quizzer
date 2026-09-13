import type { GetQuizApiResponseDto } from 'quizzer-lib';

export type QuizSessionStatus = 'idle' | 'active' | 'finished';

export interface QuizSessionState {
  status: QuizSessionStatus;
  queue: GetQuizApiResponseDto[];
  currentIndex: number;
  correctCount: number;
  answeredCount: number;
}

export const initialQuizSessionState: QuizSessionState = {
  status: 'idle',
  queue: [],
  currentIndex: 0,
  correctCount: 0,
  answeredCount: 0
};

export type QuizSessionAction =
  | { type: 'START'; queue: GetQuizApiResponseDto[] }
  | { type: 'ANSWER'; isCorrect: boolean }
  | { type: 'RESET' };

// 出題セッションの状態遷移（純粋関数）
// START: 取得したN問をキューにセットし、出題を開始する
// ANSWER: 現在の問題に解答し、正解数を加算しつつ次の問題に進める。全問終了していればfinishedにする
// RESET: 出題設定に戻るため状態を初期化する
export const quizSessionReducer = (state: QuizSessionState, action: QuizSessionAction): QuizSessionState => {
  switch (action.type) {
    case 'START':
      return {
        status: action.queue.length > 0 ? 'active' : 'finished',
        queue: action.queue,
        currentIndex: 0,
        correctCount: 0,
        answeredCount: 0
      };
    case 'ANSWER': {
      // 出題中でなければ何もしない（多重送信対策）
      if (state.status !== 'active') {
        return state;
      }
      const nextIndex = state.currentIndex + 1;
      return {
        ...state,
        currentIndex: nextIndex,
        answeredCount: state.answeredCount + 1,
        correctCount: state.correctCount + (action.isCorrect ? 1 : 0),
        status: nextIndex >= state.queue.length ? 'finished' : 'active'
      };
    }
    case 'RESET':
      return initialQuizSessionState;
    default:
      return state;
  }
};
