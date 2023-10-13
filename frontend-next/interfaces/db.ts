import { ApiResponse } from './api/response';

// 以下はDBテーブル定義

// categoryからの取得結果
export interface CategoryApiResponse extends ApiResponse {
  file_num: number;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// quiz_fileからの取得結果
export interface QuizFileApiResponse extends ApiResponse {
  file_num: number;
  file_name: string;
  file_nickname: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// quizからの取得結果
export interface QuizApiResponse extends ApiResponse {
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

  dummy_choice_sentense?: string; // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
}

// quiz_viewからの取得結果(正解数、不正解数、正解率など)
export interface QuizViewApiResponse extends ApiResponse {
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
}

// categoryからの取得結果
export interface CategoryApiResponse extends ApiResponse {
  file_num: number;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

//// 以下は　english

// partofspeechからの取得結果
export interface PartofSpeechApiResponse extends ApiResponse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// sourceからの取得結果
export interface SourceApiResponse extends ApiResponse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}

// wordからの取得結果
export interface WordApiResponse extends ApiResponse {
  id: number;
  name: string;
  pronounce: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | undefined;
}
