import { BadRequestException } from '@nestjs/common';

// クエリのformat_id（カンマ区切りの問題形式ID）を数値の配列に変換する
// 空・未指定ならundefined（形式で絞り込まない）、数値でないIDがあれば400
export const parseFormatIds = (value: unknown): number[] | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new BadRequestException(
      'format_id must be provided as a comma separated string',
    );
  }
  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '');
  const invalidId = ids.find((id) => !/^\d+$/.test(id));
  if (invalidId !== undefined) {
    throw new BadRequestException(
      `format_id must contain valid numbers (invalid: ${invalidId})`,
    );
  }
  return ids.length > 0 ? Array.from(new Set(ids.map(Number))) : undefined;
};

// 問題形式で絞り込むwhere条件（指定がなければ絞り込まない）
export const formatIdCondition = (formatIds?: number[]) =>
  formatIds && formatIds.length > 0 ? { format_id: { in: formatIds } } : {};
