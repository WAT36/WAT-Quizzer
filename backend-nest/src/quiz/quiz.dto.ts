export interface SelectQuizDto {
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
  input_data: string;
}
