import { HttpException, HttpStatus } from '@nestjs/common';
import { ParseResult } from 'papaparse';
import { containsAny, prisma } from 'quizzer-lib';

// 問題文・答え・ダミー選択肢に使えない文字（画面からの登録と同じ）
const NG_CHARS = [',', '-'];
// DBのカラム長の上限
const MAX_LENGTH = {
  answer: 256,
  dummyChoice: 256,
  category: 256,
  imgFile: 128,
};

// CSVから読み込んだ問題（基礎・応用・四択で共通の項目）
export interface CsvQuizRecordBase {
  lineNumber: number; // CSVの何行目か（空行を除く）
  file_num: number;
  question: string;
  answer: string;
  explanation?: string;
  categories: string[];
}

// 基礎・応用問題CSVの1行
export interface QuizCsvRecord extends CsvQuizRecordBase {
  format_id: number;
  img_file?: string;
}

// 四択問題CSVの1行
export interface FourChoiceQuizCsvRecord extends CsvQuizRecordBase {
  answer_num: number;
  dummyChoices: [string, string, string];
}

// バリデーションで使うDB操作（トランザクション外のprismaを渡す想定）
type CsvValidationDb = Pick<typeof prisma, 'quiz' | 'quiz_file'>;

// 1行分のエラーを集める
class RowErrors {
  readonly messages: string[] = [];

  constructor(private readonly lineNumber: number) {}

  add(message: string) {
    this.messages.push(`${this.lineNumber}行目: ${message}`);
  }
}

// 1以上の整数か
const toPositiveInt = (value: string): number | undefined =>
  /^[1-9]\d*$/.test(value) ? +value : undefined;

// 必須の文字列項目をチェック
const checkRequiredText = (
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

// ':'区切りのカテゴリを分割する（空要素・重複は除く）
const parseCategories = (errors: RowErrors, value: string): string[] => {
  const categories = Array.from(
    new Set(
      value
        .split(':')
        .map((c) => c.trim())
        .filter((c) => c !== ''),
    ),
  );
  for (const c of categories) {
    if (c.length > MAX_LENGTH.category) {
      errors.add(
        `カテゴリ「${c}」は${MAX_LENGTH.category}文字以内にしてください`,
      );
    }
  }
  return categories;
};

// CSV全体の読み込みエラー・件数をチェック
const checkParseResult = (csvData: ParseResult<string[]>): string[] => {
  const errors = csvData.errors.map(
    (e) =>
      `${e.row !== undefined ? `${e.row + 1}行目: ` : ''}CSVの読み込みに失敗しました(${e.message})`,
  );
  if (csvData.data.length === 0) {
    errors.push('登録する問題がありません');
  }
  return errors;
};

// 基礎・応用問題CSVの各行をチェックし、登録用のデータに変換する
export const parseQuizCsvRows = (
  rows: string[][],
): { records: QuizCsvRecord[]; errors: string[] } => {
  const records: QuizCsvRecord[] = [];
  const errors: string[] = [];
  for (const [index, row] of rows.entries()) {
    const rowErrors = new RowErrors(index + 1);
    // (問題形式,問題ファイル番号,問題文,答え文,解説,カテゴリ,画像ファイル名)
    if (row.length !== 7) {
      rowErrors.add(`列数が正しくありません(${row.length}列、正しくは7列)`);
      errors.push(...rowErrors.messages);
      continue;
    }
    const [
      format_id,
      file_num,
      question,
      answer,
      explanation,
      categories,
      img_file,
    ] = row;
    if (format_id !== '1' && format_id !== '2') {
      rowErrors.add(`問題形式は1(基礎)か2(応用)にしてください(${format_id})`);
    }
    const fileNum = toPositiveInt(file_num);
    if (fileNum === undefined) {
      rowErrors.add(`ファイル番号が正しくありません(${file_num})`);
    }
    checkRequiredText(rowErrors, '問題文', question, { ngChars: NG_CHARS });
    checkRequiredText(rowErrors, '答え', answer, {
      maxLength: MAX_LENGTH.answer,
      ngChars: NG_CHARS,
    });
    if (img_file.length > MAX_LENGTH.imgFile) {
      rowErrors.add(
        `画像ファイル名は${MAX_LENGTH.imgFile}文字以内にしてください`,
      );
    }
    const categoryList = parseCategories(rowErrors, categories);

    if (rowErrors.messages.length > 0) {
      errors.push(...rowErrors.messages);
      continue;
    }
    records.push({
      lineNumber: index + 1,
      format_id: +format_id,
      file_num: fileNum,
      question,
      answer,
      explanation: explanation || undefined,
      categories: categoryList,
      img_file: img_file || undefined,
    });
  }
  return { records, errors };
};

// 四択問題CSVの各行をチェックし、登録用のデータに変換する
export const parseFourChoiceQuizCsvRows = (
  rows: string[][],
): { records: FourChoiceQuizCsvRecord[]; errors: string[] } => {
  const records: FourChoiceQuizCsvRecord[] = [];
  const errors: string[] = [];
  for (const [index, row] of rows.entries()) {
    const rowErrors = new RowErrors(index + 1);
    // (問題ファイル番号,答えの数,問題文,答え文,ダミー選択肢1,ダミー選択肢2,ダミー選択肢3,解説,カテゴリ)
    if (row.length !== 9) {
      rowErrors.add(`列数が正しくありません(${row.length}列、正しくは9列)`);
      errors.push(...rowErrors.messages);
      continue;
    }
    const [
      file_num,
      answer_num,
      question,
      answer,
      dummy1,
      dummy2,
      dummy3,
      explanation,
      categories,
    ] = row;
    const fileNum = toPositiveInt(file_num);
    if (fileNum === undefined) {
      rowErrors.add(`ファイル番号が正しくありません(${file_num})`);
    }
    const answerNum = toPositiveInt(answer_num);
    if (answerNum === undefined || answerNum > 4) {
      rowErrors.add(`答えの数は1〜4にしてください(${answer_num})`);
    }
    checkRequiredText(rowErrors, '問題文', question, { ngChars: NG_CHARS });
    checkRequiredText(rowErrors, '答え', answer, {
      maxLength: MAX_LENGTH.answer,
      ngChars: NG_CHARS,
    });
    for (const [i, dummy] of [dummy1, dummy2, dummy3].entries()) {
      checkRequiredText(rowErrors, `ダミー選択肢${i + 1}`, dummy, {
        maxLength: MAX_LENGTH.dummyChoice,
        ngChars: NG_CHARS,
      });
    }
    const categoryList = parseCategories(rowErrors, categories);

    if (rowErrors.messages.length > 0) {
      errors.push(...rowErrors.messages);
      continue;
    }
    records.push({
      lineNumber: index + 1,
      file_num: fileNum,
      answer_num: answerNum,
      question,
      answer,
      dummyChoices: [dummy1, dummy2, dummy3],
      explanation: explanation || undefined,
      categories: categoryList,
    });
  }
  return { records, errors };
};

// DBの状態と照らし合わせてチェック（ファイルの存在・問題文の重複）
export const checkCsvRecordsWithDb = async (
  db: CsvValidationDb,
  records: CsvQuizRecordBase[],
): Promise<string[]> => {
  if (records.length === 0) {
    return [];
  }
  const errors: string[] = [];

  // CSV内での問題文の重複
  const firstLineByQuestion = new Map<string, number>();
  for (const { lineNumber, question } of records) {
    const firstLine = firstLineByQuestion.get(question);
    if (firstLine !== undefined) {
      errors.push(
        `${lineNumber}行目: 問題文が${firstLine}行目と重複しています`,
      );
    } else {
      firstLineByQuestion.set(question, lineNumber);
    }
  }

  // 問題ファイルの存在
  const fileNums = Array.from(new Set(records.map((r) => r.file_num)));
  const existingFiles = await db.quiz_file.findMany({
    select: { file_num: true },
    where: { file_num: { in: fileNums }, deleted_at: null },
  });
  const existingFileNums = new Set(existingFiles.map((f) => f.file_num));
  for (const { lineNumber, file_num } of records) {
    if (!existingFileNums.has(file_num)) {
      errors.push(
        `${lineNumber}行目: ファイル番号${file_num}の問題ファイルが存在しません`,
      );
    }
  }

  // 登録済みの問題文との重複（問題文は削除済みも含めて一意）
  const existingQuizzes = await db.quiz.findMany({
    select: { quiz_sentense: true },
    where: { quiz_sentense: { in: Array.from(firstLineByQuestion.keys()) } },
  });
  const existingQuestions = new Set(
    existingQuizzes.map((q) => q.quiz_sentense),
  );
  for (const { lineNumber, question } of records) {
    if (existingQuestions.has(question)) {
      errors.push(
        `${lineNumber}行目: 同じ問題文の問題がすでに登録されています`,
      );
    }
  }

  return errors;
};

// エラーがあればまとめて400で返す
const throwIfErrors = (errors: string[]) => {
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

// 基礎・応用問題CSVを検証し、登録用のデータを返す
export const validateQuizCsv = async (
  db: CsvValidationDb,
  csvData: ParseResult<string[]>,
): Promise<QuizCsvRecord[]> => {
  throwIfErrors(checkParseResult(csvData));
  const { records, errors } = parseQuizCsvRows(csvData.data);
  throwIfErrors([...errors, ...(await checkCsvRecordsWithDb(db, records))]);
  return records;
};

// 四択問題CSVを検証し、登録用のデータを返す
export const validateFourChoiceQuizCsv = async (
  db: CsvValidationDb,
  csvData: ParseResult<string[]>,
): Promise<FourChoiceQuizCsvRecord[]> => {
  throwIfErrors(checkParseResult(csvData));
  const { records, errors } = parseFourChoiceQuizCsvRows(csvData.data);
  throwIfErrors([...errors, ...(await checkCsvRecordsWithDb(db, records))]);
  return records;
};
