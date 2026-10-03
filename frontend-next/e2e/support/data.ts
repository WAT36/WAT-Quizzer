import type {
  GetCategoryAPIResponseDto,
  GetEnglishWordTestDataAPIResponseDto,
  GetQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  GetQuizFormatApiResponseDto,
  PartofSpeechApiResponse,
  SourceApiResponse
} from 'quizzer-lib';
import type { ApiMock } from './api-mock';

// E2Eテストで使うAPIの応答データ
// 型はquizzer-libのDTOを使い、APIの形が変わったときにここで気づけるようにしている

// ---- quizzer ----

export const quizFiles: GetQuizFileApiResponseDto[] = [
  { file_num: 1, file_name: 'programming', file_nickname: 'プログラミング基礎問題集' },
  { file_num: 2, file_name: 'aws', file_nickname: 'AWS認定試験対策' }
];

export const quizFormats: GetQuizFormatApiResponseDto[] = [
  { id: 1, name: '基礎問題' },
  { id: 2, name: '応用問題' },
  { id: 3, name: '四択問題' }
];

export const categories: GetCategoryAPIResponseDto[] = [
  { file_num: 1, category: 'JavaScript' },
  { file_num: 1, category: '非同期処理' }
];

export const quizzes: GetQuizApiResponseDto[] = [
  {
    id: 101,
    file_num: 1,
    quiz_num: 1,
    format_id: 1,
    quiz_sentense: 'JavaScriptで再代入できない変数を宣言するキーワードは？',
    answer: 'const',
    checked: false,
    quiz_category: [{ category: 'JavaScript' }],
    quiz_statistics_view: { clear_count: 3, fail_count: 1, accuracy_rate: 75 }
  },
  {
    id: 102,
    file_num: 1,
    quiz_num: 2,
    format_id: 1,
    quiz_sentense: 'Promiseが成功したときの状態名は？',
    answer: 'fulfilled',
    checked: false,
    quiz_category: [{ category: '非同期処理' }],
    quiz_statistics_view: { clear_count: 0, fail_count: 2, accuracy_rate: 0 }
  }
];

// quizzerの各画面が開いたときに読み込む、問題ファイル・問題形式・カテゴリの一覧を差し替える
export const mockQuizzerMasterData = (api: ApiMock) => {
  api.on('GET', '/quiz/file', { json: quizFiles });
  api.on('GET', '/quiz/format', { json: quizFormats });
  api.on('GET', '/category', { json: categories });
};

// ---- englishBot ----

// 出典のプルダウンは選択肢が1件以下だと操作できない仕様のため、2件用意している
export const sources: SourceApiResponse[] = [
  { id: 1, name: 'TOEIC', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: undefined },
  { id: 2, name: '英検準1級', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: undefined }
];

export const partsOfSpeech: PartofSpeechApiResponse[] = [
  { id: 1, name: '動詞', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: undefined },
  { id: 2, name: '名詞', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', deleted_at: undefined }
];

// englishBotの単語追加・詳細画面が開いたときに読み込む、品詞・出典の一覧を差し替える
export const mockEnglishMasterData = (api: ApiMock) => {
  api.on('GET', '/english/partsofspeech', { json: partsOfSpeech });
  api.on('GET', '/english/source', { json: sources });
};

export const wordTestData: GetEnglishWordTestDataAPIResponseDto = {
  total: 120,
  word: {
    id: 501,
    name: 'abandon',
    checked: false,
    mean: [
      {
        id: 1,
        word_id: 501,
        wordmean_id: 1,
        meaning: '捨てる、見捨てる',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        deleted_at: new Date('2024-01-01T00:00:00Z'),
        partsofspeech: { id: 1, name: '動詞' }
      }
    ],
    word_source: [{ source: { id: 1, name: 'TOEIC' } }],
    word_statistics_view: { accuracy_rate: '50', answer_count: 4 }
  }
};
