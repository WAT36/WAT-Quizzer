import { WORD_TEST_TYPE } from 'quizzer-lib';

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
