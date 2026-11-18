import { getRandomElementsFromArray } from 'quizzer-lib';

// quizzer-libにはテスト環境がないため、利用側のbackend-nestでテストする
describe('getRandomElementsFromArray', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('要素数以上を指定した場合も、元の並びのままではなく並び替えて全件返す', () => {
    // Math.random()が常に0 → Fisher–Yatesで [1,2,3,4] は [2,3,4,1] になる
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const arr = [1, 2, 3, 4];
    const result = getRandomElementsFromArray(arr, 10);
    expect(result).toEqual([2, 3, 4, 1]);
    // 元の配列は変更しない
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('要素数と同じ数を指定した場合も、全件を並び替えて返す', () => {
    const arr = Array.from({ length: 50 }, (_, i) => i);
    const result = getRandomElementsFromArray(arr, arr.length);
    expect([...result].sort((a, b) => a - b)).toEqual(arr);
    // 50要素が元と同じ並びになる確率は 1/50! で実質0
    expect(result).not.toEqual(arr);
  });

  it('要素数より少ない数を指定した場合は、重複なくその数だけ返す', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i);
    const result = getRandomElementsFromArray(arr, 5);
    expect(result).toHaveLength(5);
    expect(new Set(result).size).toBe(5);
    result.forEach((x) => expect(arr).toContain(x));
  });

  it('空配列の場合は空配列を返す', () => {
    expect(getRandomElementsFromArray([], 3)).toEqual([]);
  });
});
