import { HttpException, HttpStatus } from '@nestjs/common';
import { ParseResult } from 'papaparse';
import { containsAny } from 'quizzer-lib';

// 1行分のエラーを集める
export class RowErrors {
  readonly messages: string[] = [];

  constructor(private readonly lineNumber: number) {}

  add(message: string) {
    this.messages.push(`${this.lineNumber}行目: ${message}`);
  }
}

// 1以上の整数か
export const toPositiveInt = (value: string): number | undefined =>
  /^[1-9]\d*$/.test(value) ? +value : undefined;

// 必須の文字列項目をチェック
export const checkRequiredText = (
  errors: RowErrors,
  label: string,
  value: string,
  { maxLength, ngChars }: { maxLength?: number; ngChars?: string[] } = {},
) => {
  if (value === '') {
    errors.add(`${label}が空です`);
    return;
  }
  if (maxLength && value.length > maxLength) {
    errors.add(`${label}は${maxLength}文字以内にしてください`);
  }
  if (ngChars && containsAny(value, ngChars)) {
    errors.add(`${label}にカンマ(,)、ハイフン(-)は使えません`);
  }
};

// CSV全体の読み込みエラー・件数をチェック
export const checkParseResult = (
  csvData: ParseResult<string[]>,
  emptyMessage: string, // データが1行もない場合のエラー文言
): string[] => {
  const errors = csvData.errors.map(
    (e) =>
      `${e.row !== undefined ? `${e.row + 1}行目: ` : ''}CSVの読み込みに失敗しました(${e.message})`,
  );
  if (csvData.data.length === 0) {
    errors.push(emptyMessage);
  }
  return errors;
};

// エラーがあればまとめて400で返す
export const throwIfErrors = (errors: string[]) => {
  if (errors.length > 0) {
    throw new HttpException(
      {
        message: `CSVの内容に誤りがあります(${errors.length}件)`,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};
