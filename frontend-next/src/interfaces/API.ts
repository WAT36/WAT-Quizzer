export interface ImageUploadReturnValue {
  name: string;
  isUploading: boolean;
  url: string;
}

// APIから受け取ったデータを変換しフロント側で処理する型
export interface ProcessingApiReponse {
  status: number;
  body: ApiResponse[];
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}

// quiz_fileからの取得結果
export interface QuizFileApiResponse extends ApiResponse {
  file_num: number;
  file_name: string;
  file_nickname: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}
