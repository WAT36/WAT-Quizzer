import { parse, ParseResult } from 'papaparse';
import { Readable } from 'stream';
import { removeNullChars } from 'quizzer-lib';

// アップロードされたCSVファイルを行ごとの文字列配列に変換する（各値はNUL文字と前後の空白を除く）
export const parseCsv = async (
  file: Express.Multer.File,
): Promise<ParseResult<string[]>> => {
  const stream = Readable.from(file.buffer);
  return new Promise((resolve, reject) => {
    parse(stream, {
      header: false,
      // カンマ区切りで固定する（自動判定だと、カンマのない行だけのCSVで警告がエラーとして返るため）
      delimiter: ',',
      skipEmptyLines: true,
      transform: (value: string): string => {
        // NUL文字はPostgreSQLのテキストに保存できないため取り除く
        return removeNullChars(value).trim();
      },
      complete: (results: ParseResult<string[]>) => {
        return resolve(results);
      },
      error: (error: Error) => {
        return reject(error);
      },
    });
  });
};
