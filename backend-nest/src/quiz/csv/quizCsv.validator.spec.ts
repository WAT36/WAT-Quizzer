import { HttpException } from '@nestjs/common';
import { ParseResult } from 'papaparse';
import {
  checkCsvRecordsWithDb,
  parseFourChoiceQuizCsvRows,
  parseQuizCsvRows,
  validateQuizCsv,
} from './quizCsv.validator';

// DBのモック（登録済みのファイル番号・問題文を指定する）
const createDb = ({
  fileNums = [1],
  questions = [],
}: { fileNums?: number[]; questions?: string[] } = {}) => ({
  quiz_file: {
    findMany: jest
      .fn()
      .mockResolvedValue(fileNums.map((file_num) => ({ file_num }))),
  },
  quiz: {
    findMany: jest
      .fn()
      .mockResolvedValue(questions.map((quiz_sentense) => ({ quiz_sentense }))),
  },
});

const toParseResult = (
  data: string[][],
  errors: ParseResult<string[]>['errors'] = [],
) => ({ data, errors, meta: {} }) as ParseResult<string[]>;

describe('quizCsv.validator', () => {
  describe('parseQuizCsvRows（基礎・応用問題）', () => {
    it('正しい行を登録用のデータに変換する', () => {
      const { records, errors } = parseQuizCsvRows([
        ['1', '1', '問題文', '答え', '解説', 'カテゴリA:カテゴリB', 'img.png'],
        ['2', '1', '問題文2', '答え2', '', '', ''],
      ]);
      expect(errors).toEqual([]);
      expect(records).toEqual([
        {
          lineNumber: 1,
          format_id: 1,
          file_num: 1,
          question: '問題文',
          answer: '答え',
          explanation: '解説',
          categories: ['カテゴリA', 'カテゴリB'],
          img_file: 'img.png',
        },
        {
          lineNumber: 2,
          format_id: 2,
          file_num: 1,
          question: '問題文2',
          answer: '答え2',
          explanation: undefined,
          categories: [],
          img_file: undefined,
        },
      ]);
    });

    it('カテゴリの空要素・重複を除く', () => {
      const { records } = parseQuizCsvRows([
        ['1', '1', '問題文', '答え', '', 'A::B:A:', ''],
      ]);
      expect(records[0].categories).toEqual(['A', 'B']);
    });

    it('全行のエラーを行番号付きでまとめて返す', () => {
      const { records, errors } = parseQuizCsvRows([
        ['1', '1', '問題文'],
        ['abc', '', '', '答え-1', '', '', ''],
        ['1', '1.5', '問題,文', '答え', '', '', 'a'.repeat(129)],
      ]);
      expect(records).toEqual([]);
      expect(errors).toEqual([
        '1行目: 列数が正しくありません(3列、正しくは7列)',
        '2行目: 問題形式は1(基礎)か2(応用)にしてください(abc)',
        '2行目: ファイル番号が正しくありません()',
        '2行目: 問題文が空です',
        '2行目: 答えにカンマ(,)、ハイフン(-)は使えません',
        '3行目: ファイル番号が正しくありません(1.5)',
        '3行目: 問題文にカンマ(,)、ハイフン(-)は使えません',
        '3行目: 画像ファイル名は128文字以内にしてください',
      ]);
    });
  });

  describe('parseFourChoiceQuizCsvRows（四択問題）', () => {
    it('正しい行を登録用のデータに変換する', () => {
      const { records, errors } = parseFourChoiceQuizCsvRows([
        ['1', '2', '問題文', '答え', 'D1', 'D2', 'D3', '解説', 'カテゴリ'],
      ]);
      expect(errors).toEqual([]);
      expect(records).toEqual([
        {
          lineNumber: 1,
          file_num: 1,
          answer_num: 2,
          question: '問題文',
          answer: '答え',
          dummyChoices: ['D1', 'D2', 'D3'],
          explanation: '解説',
          categories: ['カテゴリ'],
        },
      ]);
    });

    it('答えの数・ダミー選択肢の誤りを返す', () => {
      const { records, errors } = parseFourChoiceQuizCsvRows([
        ['1', '5', '問題文', '答え', '', 'D-2', 'D3', '', ''],
        ['1', '0', '問題文2', '答え', 'D1', 'D2', 'D3', '', ''],
      ]);
      expect(records).toEqual([]);
      expect(errors).toEqual([
        '1行目: 答えの数は1〜4にしてください(5)',
        '1行目: ダミー選択肢1が空です',
        '1行目: ダミー選択肢2にカンマ(,)、ハイフン(-)は使えません',
        '2行目: 答えの数は1〜4にしてください(0)',
      ]);
    });
  });

  describe('checkCsvRecordsWithDb', () => {
    const record = (
      lineNumber: number,
      file_num: number,
      question: string,
    ) => ({
      lineNumber,
      file_num,
      question,
      answer: '答え',
      categories: [],
    });

    it('問題ファイルの不在・問題文の重複を返す', async () => {
      const db = createDb({ fileNums: [1], questions: ['登録済み'] });
      const errors = await checkCsvRecordsWithDb(db as never, [
        record(1, 1, '問題A'),
        record(2, 2, '問題B'),
        record(3, 1, '問題A'),
        record(4, 1, '登録済み'),
      ]);
      expect(errors).toEqual([
        '3行目: 問題文が1行目と重複しています',
        '2行目: ファイル番号2の問題ファイルが存在しません',
        '4行目: 同じ問題文の問題がすでに登録されています',
      ]);
    });

    it('問題なければエラーなし', async () => {
      const errors = await checkCsvRecordsWithDb(createDb() as never, [
        record(1, 1, '問題A'),
      ]);
      expect(errors).toEqual([]);
    });
  });

  describe('validateQuizCsv', () => {
    it('エラーがあれば400でエラー一覧を返す', async () => {
      const promise = validateQuizCsv(
        createDb() as never,
        toParseResult([['1', '1', '', '答え', '', '', '']]),
      );
      await expect(promise).rejects.toBeInstanceOf(HttpException);
      await expect(promise).rejects.toMatchObject({
        status: 400,
        response: {
          message: 'CSVの内容に誤りがあります(1件)',
          errors: ['1行目: 問題文が空です'],
        },
      });
    });

    it('CSVの読み込みエラー・空のCSVはエラーにする', async () => {
      await expect(
        validateQuizCsv(
          createDb() as never,
          toParseResult(
            [['1', '1', '問題文', '答え', '', '', '']],
            [
              {
                type: 'Quotes',
                code: 'MissingQuotes',
                message: 'Quoted field unterminated',
                row: 0,
              },
            ],
          ),
        ),
      ).rejects.toMatchObject({
        response: {
          errors: [
            '1行目: CSVの読み込みに失敗しました(Quoted field unterminated)',
          ],
        },
      });
      await expect(
        validateQuizCsv(createDb() as never, toParseResult([])),
      ).rejects.toMatchObject({
        response: { errors: ['登録する問題がありません'] },
      });
    });

    it('問題なければ登録用のデータを返す', async () => {
      await expect(
        validateQuizCsv(
          createDb() as never,
          toParseResult([['1', '1', '問題文', '答え', '', '', '']]),
        ),
      ).resolves.toHaveLength(1);
    });
  });
});
