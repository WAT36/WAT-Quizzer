export interface MessageState {
  message: string;
  messageColor: string;
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

export interface QueryOfAddQuizState {
  fileNum: number;
  question?: string;
  answer?: string;
  category?: string;
  img_file?: string;
  matched_basic_quiz_id?: string;
  dummy1?: string; //四択問題のダミー選択肢１
  dummy2?: string; //四択問題のダミー選択肢２
  dummy3?: string; //四択問題のダミー選択肢３
}

export interface QueryOfGetWordState {
  source?: string;
}

export interface SayingState {
  saying: string;
  color: string;
}

export interface DbHealthCheckState {
  status: string;
  color: string;
}
