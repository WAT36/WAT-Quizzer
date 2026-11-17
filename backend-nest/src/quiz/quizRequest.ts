import { HttpException, HttpStatus } from '@nestjs/common';

// 問題APIのリクエスト値の整形・バリデーション

// 文頭と末尾の半角・全角スペースを削除
export const trimSpaces = (str: string): string =>
  str ? str.replace(/^[ \u3000]+|[ \u3000]+$/g, '') : str;

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
