import { HttpException, HttpStatus } from '@nestjs/common';

// 問題APIのリクエスト値の整形・バリデーション

// 文頭と末尾の半角・全角スペースを削除
export const trimSpaces = (str: string): string =>
  str ? str.replace(/^[ \u3000]+|[ \u3000]+$/g, '') : str;

// 問題IDの配列(空でない整数の配列)であることを確認し、違えば400にする
export function assertQuizIds(quiz_ids: unknown): asserts quiz_ids is number[] {
  if (
    !Array.isArray(quiz_ids) ||
    quiz_ids.length === 0 ||
    !quiz_ids.every((x) => Number.isInteger(x))
  ) {
    throw new HttpException(
      `問題番号が不正です(${JSON.stringify(quiz_ids)})`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

// 関連基礎問題番号(カンマ区切り)を数値の配列にする。数値でないものがあれば400にする
export const parseMatchedBasicQuizIds = (ids: string | undefined): number[] =>
  ids
    ? ids.split(',').map((id) => {
        if (isNaN(+id)) {
          throw new HttpException(
            `入力した関連基礎問題番号でエラーが発生しました；("${id}"は数値ではありません)`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +id;
      })
    : [];
