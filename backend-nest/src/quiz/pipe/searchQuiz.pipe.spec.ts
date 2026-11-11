import { BadRequestException } from '@nestjs/common';
import { SearchQuizPipe } from './searchQuiz.pipe';

jest.mock('quizzer-lib', () => ({
  parseStrToBool: (value: string) => value === 'true',
}));

describe('SearchQuizPipe', () => {
  const pipe = new SearchQuizPipe();

  it('format_idをIDの配列に変換する（空なら絞り込まない）', () => {
    expect(
      pipe.transform({ query: '', file_num: '1', format_id: '2,1' }),
    ).toEqual({ query: '', file_num: 1, format_id: [2, 1] });
    expect(pipe.transform({ query: '', file_num: '1', format_id: '' })).toEqual(
      { query: '', file_num: 1 },
    );
  });

  it('format_idに数値でない値があれば400', () => {
    expect(() =>
      pipe.transform({ query: '', file_num: '1', format_id: 'abc' }),
    ).toThrow(BadRequestException);
  });

  it('JSON文字列のカテゴリ配列を配列に変換する', () => {
    expect(
      pipe.transform({
        query: '',
        file_num: '1',
        category_and: JSON.stringify(['A', 'B,C']),
        category_not: JSON.stringify(['E']),
      }),
    ).toEqual({
      query: '',
      file_num: 1,
      category_and: ['A', 'B,C'],
      category_not: ['E'],
    });
  });

  it('前後の空白をトリムし、空文字と重複を除く', () => {
    expect(
      pipe.transform({
        query: '',
        file_num: '1',
        category_and: JSON.stringify([' A ', 'A', '', '  ', 'B']),
      }),
    ).toEqual({ query: '', file_num: 1, category_and: ['A', 'B'] });
  });

  it('不正な値・空配列はカテゴリ条件として扱わない', () => {
    expect(
      pipe.transform({
        query: '',
        file_num: '1',
        category_and: 'not json',
        category_not: JSON.stringify('A'),
      }),
    ).toEqual({ query: '', file_num: 1 });
    expect(
      pipe.transform({
        query: '',
        file_num: '1',
        category_and: JSON.stringify([]),
      }),
    ).toEqual({ query: '', file_num: 1 });
  });

  it('文字列以外の要素は除く', () => {
    expect(
      pipe.transform({
        query: '',
        file_num: '1',
        category_not: JSON.stringify(['A', 1, null, { name: 'B' }]),
      }),
    ).toEqual({ query: '', file_num: 1, category_not: ['A'] });
  });
});
