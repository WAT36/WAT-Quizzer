import { getQuizAPIRequestSchema } from 'quizzer-lib';

// 問題取得APIのクエリ（値はすべて文字列で届く）のうち、回答数の範囲指定の検証
describe('getQuizAPIRequestSchema - 回答数の範囲指定', () => {
  const parse = (query: Record<string, string>) =>
    getQuizAPIRequestSchema.safeParse({ file_num: '1', ...query });

  it('0以上の整数なら数値にする（0回も指定できる）', () => {
    const result = parse({ min_answer_count: '0', max_answer_count: '5' });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      min_answer_count: 0,
      max_answer_count: 5,
    });
  });

  it('未指定（空文字・-1）ならundefined', () => {
    const result = parse({ min_answer_count: '', max_answer_count: '-1' });
    expect(result.success).toBe(true);
    expect(result.data?.min_answer_count).toBeUndefined();
    expect(result.data?.max_answer_count).toBeUndefined();
  });

  it('負の数・小数・数値でない値は不正', () => {
    expect(parse({ min_answer_count: '-2' }).success).toBe(false);
    expect(parse({ min_answer_count: '1.5' }).success).toBe(false);
    expect(parse({ max_answer_count: 'abc' }).success).toBe(false);
  });

  it('以上が以下より大きければ不正、同じ値ならよい', () => {
    expect(
      parse({ min_answer_count: '6', max_answer_count: '5' }).success,
    ).toBe(false);
    expect(
      parse({ min_answer_count: '5', max_answer_count: '5' }).success,
    ).toBe(true);
  });
});
