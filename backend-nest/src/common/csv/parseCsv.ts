import { parse, ParseResult } from 'papaparse';
import { Readable } from 'stream';

// アップロードされたCSVファイルを行ごとの文字列配列に変換する（各値は前後の空白を除く）
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
        return value.trim();
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
