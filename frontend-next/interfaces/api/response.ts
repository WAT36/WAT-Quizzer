export interface ImageUploadReturnValue {
  name: string;
  isUploading: boolean;
  url: string;
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}

// APIから受け取ったデータを変換しフロント側で処理する型
export interface ProcessingApiReponse {
  status: number;
  body: ApiResponse[];
}

// 問題追加APIの返り値の型
export interface AddQuizApiResponse extends ApiResponse {
  result: string;
}

// 問題チェックAPIの返り値の型
export interface CheckQuizApiResponse extends ApiResponse {
  result: boolean;
}

// (指定ファイルのカテゴリ毎の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateByCategorySqlResultDto {
  file_num: number;
  c_category: string;
  count: number;
  accuracy_rate: number;
}

// (指定ファイルのチェック済の)正解率が入ったDTO(SQL実行結果)
export interface AccuracyRateOfCheckedQuizSqlResultDto {
  checked: boolean;
  count: number;
  sum_clear: number;
  sum_fail: number;
  accuracy_rate: number;
}

// カテゴリ正解率取得API 返り値DTO
export interface GetAccuracyRateByCategoryServiceDto extends ApiResponse {
  result: AccuracyRateByCategorySqlResultDto[];
  checked_result: AccuracyRateOfCheckedQuizSqlResultDto[];
}

//// 以下は　english

// 英単語（単語名で）取得APIの返り値
export interface EnglishWordByNameApiResponse extends ApiResponse {
  word_id: string;
  name: string;
  pronounce: string;
  id: number; //mean.id
  wordmean_id: number;
  meaning: string;
  partsofspeech_id: number;
  partsofspeech: string; // partofspeech.name
  source_id: number;
  source_name: string;
}

// 英単語（単語IDで）取得APIの返り値
export interface EnglishWordByIdApiResponse extends ApiResponse {
  word_id: string;
  name: string;
  pronounce: string;
  mean_id: number; //mean.id
  wordmean_id: number;
  meaning: string;
  partsofspeech_id: number;
  partsofspeech: string; // partofspeech.name
  source_id: number;
  source_name: string;
}

/// 以下、格言(saying)系

export interface GetRandomSayingResponse extends ApiResponse {
  saying: string;
}

export interface GetSelfHelpBookResponse extends ApiResponse {
  id: number;
  name: string;
}

// 画面で利用するデータ型
// (Quizzer)

// TODO これはresponse.tsではなくrequest.tsにして分けるべきでは？
// 問題追加画面で、入力されたデータを格納するデータ型
export interface addQuizDto {
  question?: string;
  answer?: string;
  category?: string;
  img_file?: string;
  matched_basic_quiz_id?: string;
  dummy1?: string; //四択問題のダミー選択肢１
  dummy2?: string; //四択問題のダミー選択肢２
  dummy3?: string; //四択問題のダミー選択肢３
}

// (英単語画面)

// 英単語追加画面で利用する、入力した単語の意味のデータ型
export interface meanOfAddWordDto {
  pos: {
    id: number;
    name?: string;
  };
  source: {
    id: number;
    name?: string;
  };
  mean: string | undefined;
}

// 英単語追加画面で入力した単語、意味のデータを　英単語追加APIに送るためのデータ型
export interface SendToAddWordApiData {
  partOfSpeechId: number;
  sourceId: number;
  meaning: string;
  partOfSpeechName?: string;
  sourceName?: string;
}
