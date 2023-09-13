// 問題の詳細情報を取得した結果のDTO
export interface QuizDto {
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
}
