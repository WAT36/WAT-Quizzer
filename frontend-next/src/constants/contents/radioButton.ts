import { WORD_TEST_TYPE } from 'quizzer-lib';

// 英単語テスト画面で出題する対象（単語 / 例文）
export const ENGLISH_TEST_TARGET = {
  WORD: '0',
  EXAMPLE: '1'
} as const;

export const englishTestTargetRadioButton = [
  {
    value: ENGLISH_TEST_TARGET.WORD,
    label: 'Word'
  },
  {
    value: ENGLISH_TEST_TARGET.EXAMPLE,
    label: 'Example'
  }
];

export const englishTestTypeRadioButton = [
  {
    value: String(WORD_TEST_TYPE.NAME),
    label: '単語名'
  },
  {
    value: String(WORD_TEST_TYPE.FOUR_CHOICE),
    label: '四択'
  },
  {
    value: String(WORD_TEST_TYPE.MEANING),
    label: '意味当て'
  }
];

export const englishWordTypeRadioButton = [
  {
    value: 'all',
    label: 'すべて'
  },
  {
    value: 'word',
    label: '単語のみ'
  },
  {
    value: 'phrase',
    label: '熟語のみ'
  }
];
