// 問題APIのリクエスト値の整形・バリデーション

// 文頭と末尾の半角・全角スペースを削除
export const trimSpaces = (str: string): string =>
  str ? str.replace(/^[ \u3000]+|[ \u3000]+$/g, '') : str;

// 関連基礎問題番号(カンマ区切り)を数値の配列にする
// コントローラーのスキーマで、正の整数だけのカンマ区切りに整えてある
export const parseMatchedBasicQuizIds = (ids: string | undefined): number[] =>
  ids ? ids.split(',').map(Number) : [];
