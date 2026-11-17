import { formatIdCondition } from './formatId';

describe('formatIdCondition', () => {
  it('IDがあればformat_idで絞り込む', () => {
    expect(formatIdCondition([1, 3])).toEqual({ format_id: { in: [1, 3] } });
  });

  it('未指定・空配列なら条件を付けない', () => {
    expect(formatIdCondition(undefined)).toEqual({});
    expect(formatIdCondition([])).toEqual({});
  });
});
