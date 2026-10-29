import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';

// 英単語テストの各形式のStoryで使う出題データ
export const sampleWordTestData: GetEnglishWordTestDataAPIResponseDto = {
  word: {
    id: 1,
    name: 'abandon',
    checked: false,
    mean: [
      {
        id: 1,
        word_id: 1,
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
  },
  correct: { mean: '捨てる、見捨てる' },
  dummy: [{ mean: '受け入れる' }, { mean: '保つ' }, { mean: '始める' }]
};
