export interface SelectQuizDto {
  format: string; // TODO number, format_idを使いたい
  file_num: number;
  quiz_num: number;
}

export interface UpdateCategoryOfQuizDto {
  file_num: number;
  quiz_num: number;
  category: string;
}

export interface AddQuizDto {
  file_num: number;
  input_data: {
    question?: string;
    answer?: string;
    category?: string;
    img_file?: string;
    matched_basic_quiz_id?: string;
    dummy1?: string; //四択問題のダミー選択肢１
    dummy2?: string; //四択問題のダミー選択肢２
    dummy3?: string; //四択問題のダミー選択肢３
  };
}

export interface IntegrateQuizDto {
  pre_file_num: number;
  pre_quiz_num: number;
  post_file_num: number;
  post_quiz_num: number;
}

export interface EditQuizDto {
  format: string; // TODO number, format_idを使いたい
  file_num: number;
  quiz_num: number;
  question?: string;
  answer?: string;
  category?: string;
  img_file?: string;
  matched_basic_quiz_id?: string;
  dummy1?: string; //四択問題のダミー選択肢１
  dummy2?: string; //四択問題のダミー選択肢２
  dummy3?: string; //四択問題のダミー選択肢３
}

export interface AddFileDto {
  file_name: string;
  file_nickname: string;
}

export interface DeleteFileDto {
  file_id: number;
}

export interface DeleteAnswerLogByFile {
  file_id: number;
}

// 問題番号(のみ)を取得する用のDTO
export interface GetQuizNumSqlResultDto {
  quiz_num: number;
}

// ID(のみ)を取得する用のDTO
export interface GetIdDto {
  id: number;
}

// 応用問題IDと関連づけている基礎問題IDを取得する用のDTO
export interface GetLinkedBasisIdDto {
  id: number;
  file_num: number;
  quiz_num: number;
  basis_quiz_id: number;
}


// 問題の詳細情報を取得した結果のDTO
export type QuizDto = {
  id: number;
  file_num: number;
  quiz_num: number;
  quiz_sentense: string;
  answer: string;
  category: string | undefined;
  img_file: string | undefined;
  checked: boolean | undefined;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
};

// quiz_viewからの取得結果(正解数、不正解数、正解率など)
export interface QuizViewApiResponse {
  id: number;
  file_num: number;
  quiz_num: number;
  quiz_sentense: string;
  answer: string;
  category: string | undefined;
  img_file: string | undefined;
  checked: boolean | undefined;
  clear_count: number;
  fail_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
  accuracy_rate: number;

  matched_basic_quiz_id?: string;
  dummy_choice_sentense?: string; // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
}