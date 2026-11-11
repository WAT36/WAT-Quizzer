import { BadRequestException } from '@nestjs/common';
import { GetQuizPipe } from './getQuiz.pipe';

jest.mock('quizzer-lib', () => ({
  parseStrToBool: (value: string) => value === 'true',
}));

describe('GetQuizPipe', () => {
  const pipe = new GetQuizPipe();

  it('数値・真偽値・format_idを変換する', () => {
    expect(
      pipe.transform({
        file_num: '1',
        quiz_num: '2',
        min_rate: '10',
        max_rate: '90',
        count: '5',
        checked: 'true',
        format_id: '1,3',
        category: 'A',
      }),
    ).toEqual({
      file_num: 1,
      quiz_num: 2,
      min_rate: 10,
      max_rate: 90,
      count: 5,
      checked: true,
      format_id: [1, 3],
      category: 'A',
    });
  });

  it('format_idが空なら形式で絞り込まない', () => {
    expect(pipe.transform({ file_num: '1', format_id: '' })).toEqual({
      file_num: 1,
    });
  });

  it('format_idに数値でない値があれば400', () => {
    expect(() => pipe.transform({ file_num: '1', format_id: '1,abc' })).toThrow(
      BadRequestException,
    );
  });

  it('-1や数値でない番号は指定なしとして扱う', () => {
    expect(
      pipe.transform({ file_num: '-1', quiz_num: 'x', category: '-1' }),
    ).toEqual({ file_num: -1 });
  });
});
