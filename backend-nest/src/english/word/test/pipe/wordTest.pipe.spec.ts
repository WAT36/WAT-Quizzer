import { WordTestPipe } from './wordTest.pipe';

describe('WordTestPipe', () => {
  const pipe = new WordTestPipe();

  // クエリの文字列を数値・真偽値に変換し、-1は指定なしとして除く
  it('クエリを変換する', () => {
    expect(
      pipe.transform({
        format: 'lru',
        source: '1',
        checked: 'true',
        min_rate: '10',
        max_rate: '-1',
      }),
    ).toEqual({ format: 'lru', source: '1', checked: true, min_rate: 10 });
  });

  // 出題形式がrandom,lru,review以外なら400
  it.each(['', 'unknown'])('format=%j は400', (format) => {
    expect(() => pipe.transform({ format })).toThrow(
      expect.objectContaining({ status: 400 }),
    );
  });
});
