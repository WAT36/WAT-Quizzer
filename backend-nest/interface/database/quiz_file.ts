// 問題ファイルの取得結果のDTO
export interface QuizFileDto {
  file_num: number;
  file_name: string;
  file_nickname: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}
