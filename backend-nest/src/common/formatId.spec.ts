import { BadRequestException } from '@nestjs/common';
import { formatIdCondition, parseFormatIds } from './formatId';

describe('parseFormatIds', () => {
  it('カンマ区切りのIDを数値の配列にする', () => {
    expect(parseFormatIds('1,3')).toEqual([1, 3]);
  });

  it('前後の空白・空要素・重複を除く', () => {
    expect(parseFormatIds(' 1 ,,3,1,')).toEqual([1, 3]);
  });

  it('未指定・空なら絞り込まない(undefined)', () => {
    expect(parseFormatIds(undefined)).toBeUndefined();
    expect(parseFormatIds('')).toBeUndefined();
    expect(parseFormatIds(',,')).toBeUndefined();
  });

  it('数値でないIDがあれば400', () => {
    expect(() => parseFormatIds('1,abc')).toThrow(BadRequestException);
    expect(() => parseFormatIds('1a')).toThrow(BadRequestException);
    expect(() => parseFormatIds('-1')).toThrow(BadRequestException);
  });

  it('文字列以外(配列・オブジェクト)は400', () => {
    expect(() => parseFormatIds(['1', '2'])).toThrow(BadRequestException);
    expect(() => parseFormatIds({ '1': 'true' })).toThrow(BadRequestException);
  });
});

describe('formatIdCondition', () => {
  it('IDがあればformat_idで絞り込む', () => {
    expect(formatIdCondition([1, 3])).toEqual({ format_id: { in: [1, 3] } });
  });

  it('未指定・空配列なら条件を付けない', () => {
    expect(formatIdCondition(undefined)).toEqual({});
    expect(formatIdCondition([])).toEqual({});
  });
});
