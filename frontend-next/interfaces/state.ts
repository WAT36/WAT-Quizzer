// TODO stateはAPI responseの型とまとめたい　そしてこれもquizzer-libに持っていきたい
export interface MessageState {
  message: string;
  messageColor: string;
  isDisplay?: boolean;
}

export interface LoginState {
  username: string;
  password: string;
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

export interface QueryOfSearchQuizState {
  fileNum: number;
  query: string;
  format: string;
  minRate?: number;
  maxRate?: number;
  category?: string;
  checked?: boolean;
  cond?: {
    question?: boolean;
    answer?: boolean;
  };
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

export interface QueryOfDeleteQuizState {
  fileNum: number;
  quizNum: number;
  format?: string;
}

export interface QueryOfIntegrateToQuizState {
  fileNum: number;
  quizNum: number;
  format?: string;
}

export interface QueryOfGetAccuracyState {
  fileNum: number;
}

export interface DeleteQuizInfoState {
  fileNum?: number;
  quizNum?: number;
  sentense?: string;
  answer?: string;
  category?: string;
  image?: string;
}

export interface IntegrateToQuizInfoState {
  fileNum?: number;
  quizNum?: number;
  sentense?: string;
  answer?: string;
  category?: string;
  image?: string;
}

export interface QueryOfGetWordState {
  source?: string;
  subSource?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface QueryOfSearchWordState {
  query: string;
  subSource?: {
    query?: string;
  };
}

export interface FourChoiceData {
  correct: {
    mean: string;
  };
  dummy: {
    mean: string;
  }[];
}
export interface DisplayWordTestState {
  wordId?: number;
  wordName?: string;
  wordMean?: {
    id: number;
    word_id: number;
    wordmean_id: number;
    partsofspeech_id: number;
    meaning: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
  }[];
  choice?: FourChoiceData;
}

export interface InputAddWordState {
  wordName: string;
  sourceId: number;
  newSourceName?: string;
  subSourceName: string;
}

export interface WordMeanData {
  mean_source: {
    source: {
      id: number;
      name: string;
    };
  }[];
  partsofspeech: {
    id: number;
    name: string;
  };
  id: number;
  wordmean_id: number;
  meaning: string;
}

export interface WordSourceData {
  word: {
    id: number;
    name: string;
  };
  source: {
    id: number;
    name: string;
  }[];
}

export interface WordSubSourceData {
  subsource: string;
}

export interface WordDetailData {
  id: number;
  name: string;
  pronounce: string;
  mean: WordMeanData[];
  word_subsource: WordSubSourceData[];
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

// 格言取得
export interface EditQueryOfSaying {
  id: number;
  saying: string;
  explanation?: string;
}
