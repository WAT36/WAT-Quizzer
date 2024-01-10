export interface MessageState {
  message: string;
  messageColor: string;
  isDisplay?: boolean;
}

export interface PullDownOptionState {
  value: string;
  label: string;
}

export interface DisplayQuizState {
  fileNum: number;
  quizNum: number;
  quizSentense: string;
  quizAnswer: string;
  checked: boolean;
  expanded: boolean;
  explanation?: string; // 解説
}

// TODO 名前変える　QueryOfGetQuizState
export interface QueryOfQuizState {
  fileNum: number;
  quizNum: number;
  format: string;
  minRate?: number;
  maxRate?: number;
  category?: string;
  checked?: boolean;
}

export interface QueryOfPutQuizState {
  fileNum: number;
  quizNum: number;
  format?: string;
  formatValue?: number;
  question?: string;
  answer?: string;
  category?: string;
  img_file?: string;
  matched_basic_quiz_id?: string;
  dummy1?: string; //四択問題のダミー選択肢１
  dummy2?: string; //四択問題のダミー選択肢２
  dummy3?: string; //四択問題のダミー選択肢３
  explanation?: string; // 解説
}

export interface QueryOfEditQuizState {
  fileNum: number;
  quizNum: number;
  format?: string;
}

export interface QueryOfGetWordState {
  source?: string;
}

export interface DisplayWordTestState {
  wordId?: number;
  wordName?: string;
  choice?: {
    correct: {
      mean: string;
    };
    dummy: {
      mean: string;
    }[];
  };
}

export interface WordMeanData {
  wordId: number;
  wordName: string;
  wordmeanId: number;
  meanId: number;
  mean: string;
  partofspeechId: number;
  partofspeechName: string;
}

export interface WordSourceData {
  wordId: number;
  wordName: string;
  sourceId: number;
  sourceName: string;
}

export interface SayingState {
  saying: string;
  explanation: string;
  name: string;
  color: string;
}

// 追加する格言のステート型
export interface InputSayingState {
  bookId: number;
  saying: string;
  explanation: string;
}

export interface DbHealthCheckState {
  status: string;
  color: string;
}
