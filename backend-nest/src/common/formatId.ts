// 問題形式で絞り込むwhere条件（指定がなければ絞り込まない）
export const formatIdCondition = (formatIds?: number[]) =>
  formatIds && formatIds.length > 0 ? { format_id: { in: formatIds } } : {};
