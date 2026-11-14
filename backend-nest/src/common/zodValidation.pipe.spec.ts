import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zodValidation.pipe';

const schema = z.object({
  file_num: z.number(),
  question: z.string().min(1, '問題文を入力してください'),
  tags: z.array(z.string()).optional(),
});

const pipe = new ZodValidationPipe(schema);

// 投げられた400のmessageを取り出す
const errorMessageOf = (value: unknown): unknown => {
  try {
    pipe.transform(value);
  } catch (e) {
    expect(e).toBeInstanceOf(BadRequestException);
    return ((e as BadRequestException).getResponse() as { message: unknown })
      .message;
  }
  throw new Error('例外が投げられなかった');
};

describe('ZodValidationPipe', () => {
  it('スキーマに合えばスキーマで変換した後の値を返す', () => {
    expect(pipe.transform({ file_num: 1, question: 'Q', extra: 'x' })).toEqual({
      file_num: 1,
      question: 'Q',
    });
  });

  it('型が違えば400', () => {
    expect(() => pipe.transform({ file_num: '1', question: 'Q' })).toThrow(
      BadRequestException,
    );
  });

  it('必須項目がなければ400', () => {
    expect(() => pipe.transform({ question: 'Q' })).toThrow(
      BadRequestException,
    );
  });

  it('オブジェクトでなければ400', () => {
    expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
    expect(() => pipe.transform('abc')).toThrow(BadRequestException);
  });

  it('messageは項目名と理由を1行の文字列にまとめる', () => {
    const message = errorMessageOf({ file_num: 1, question: '' });
    expect(message).toBe('question: 問題文を入力してください');
  });

  it('複数の項目が不正なら「 / 」でつなぐ', () => {
    const message = errorMessageOf({ question: '', tags: ['a', 1] });
    expect(typeof message).toBe('string');
    const parts = (message as string).split(' / ');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toMatch(/^file_num: /);
    expect(parts[1]).toBe('question: 問題文を入力してください');
    expect(parts[2]).toMatch(/^tags\.1: /);
  });

  it('値そのものが不正なら項目名なしで理由だけ', () => {
    const message = errorMessageOf('abc');
    expect(typeof message).toBe('string');
    expect(message).not.toMatch(/^: /);
  });
});
