import { ParseResult } from 'papaparse';
import { prisma } from 'quizzer-lib';
import {
  checkParseResult,
  checkRequiredText,
  RowErrors,
  throwIfErrors,
  toPositiveInt,
} from '../../common/csv/csvValidation';

// DBのカラム長の上限
const MAX_SAYING_LENGTH = 256;

// 格言CSVの1行（2行目以降）
export interface SayingCsvRecord {
  lineNumber: number; // CSVの何行目か（空行を除く）
  saying: string;
  explanation: string;
}

// 格言CSVの内容（1行目の出典ID + 2行目以降の格言）
export interface SayingCsvData {
  book_id: number;
  records: SayingCsvRecord[];
}

// バリデーションで使うDB操作
type SayingCsvValidationDb = Pick<typeof prisma, 'saying' | 'selfhelp_book'>;

// 格言CSVの各行をチェックし、登録用のデータに変換する
export const parseSayingCsvRows = (
  rows: string[][],
): { book_id?: number; records: SayingCsvRecord[]; errors: string[] } => {
  const errors: string[] = [];

  // 1行目: 出典ID
  const [header = [], ...sayingRows] = rows;
  const book_id = header.length === 1 ? toPositiveInt(header[0]) : undefined;
  if (book_id === undefined) {
    errors.push(`1行目: 出典IDが正しくありません(${header.join(',')})`);
  }
  if (sayingRows.length === 0) {
    errors.push('登録する格言がありません');
  }

  // 2行目以降: 格言,解説
  const records: SayingCsvRecord[] = [];
  for (const [index, row] of sayingRows.entries()) {
    const lineNumber = index + 2;
    const rowErrors = new RowErrors(lineNumber);
    if (row.length !== 2) {
      rowErrors.add(`列数が正しくありません(${row.length}列、正しくは2列)`);
      errors.push(...rowErrors.messages);
      continue;
    }
    const [saying, explanation] = row;
    checkRequiredText(rowErrors, '格言', saying, {
      maxLength: MAX_SAYING_LENGTH,
    });
    if (rowErrors.messages.length > 0) {
      errors.push(...rowErrors.messages);
      continue;
    }
    records.push({ lineNumber, saying, explanation });
  }
  return { book_id, records, errors };
};

// DBの状態と照らし合わせてチェック（出典の存在・格言の重複）
export const checkSayingCsvWithDb = async (
  db: SayingCsvValidationDb,
  book_id: number | undefined,
  records: SayingCsvRecord[],
): Promise<string[]> => {
  const errors: string[] = [];

  // 出典の存在
  if (book_id !== undefined) {
    const book = await db.selfhelp_book.findFirst({
      select: { id: true },
      where: { id: book_id, deleted_at: null },
    });
    if (!book) {
      errors.push(`1行目: 出典ID${book_id}の本が存在しません`);
    }
  }
  if (records.length === 0) {
    return errors;
  }

  // CSV内での格言の重複
  const firstLineBySaying = new Map<string, number>();
  for (const { lineNumber, saying } of records) {
    const firstLine = firstLineBySaying.get(saying);
    if (firstLine !== undefined) {
      errors.push(`${lineNumber}行目: 格言が${firstLine}行目と重複しています`);
    } else {
      firstLineBySaying.set(saying, lineNumber);
    }
  }

  // 登録済みの格言との重複（格言は削除済みも含めて一意）
  const existingSayings = await db.saying.findMany({
    select: { saying: true },
    where: { saying: { in: Array.from(firstLineBySaying.keys()) } },
  });
  const existing = new Set(existingSayings.map((s) => s.saying));
  for (const { lineNumber, saying } of records) {
    if (existing.has(saying)) {
      errors.push(`${lineNumber}行目: 同じ格言がすでに登録されています`);
    }
  }

  return errors;
};

// 格言CSVを検証し、登録用のデータを返す
export const validateSayingCsv = async (
  db: SayingCsvValidationDb,
  csvData: ParseResult<string[]>,
): Promise<SayingCsvData> => {
  throwIfErrors(checkParseResult(csvData, '登録する格言がありません'));
  const { book_id, records, errors } = parseSayingCsvRows(csvData.data);
  throwIfErrors([
    ...errors,
    ...(await checkSayingCsvWithDb(db, book_id, records)),
  ]);
  return { book_id, records };
};
