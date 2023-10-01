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
  };
}

export interface IntegrateQuizDto {
  pre_file_num: number;
  pre_quiz_num: number;
  post_file_num: number;
  post_quiz_num: number;
}

export interface EditQuizDto {
  file_num: number;
  quiz_num: number;
  question: string;
  answer: string;
  category: string;
  img_file: string;
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
