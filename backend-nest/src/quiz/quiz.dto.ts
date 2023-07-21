export interface SelectQuizDto {
  file_num: number;
  quiz_num: number;
}

export interface RemoveCategoryOfQuizDto {
  file_num: number;
  quiz_num: number;
  category: string;
}
