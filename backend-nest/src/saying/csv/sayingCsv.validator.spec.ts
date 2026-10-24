import { HttpException } from '@nestjs/common';
import { ParseResult } from 'papaparse';
import {
  checkSayingCsvWithDb,
  parseSayingCsvRows,
  validateSayingCsv,
} from './sayingCsv.validator';

// DBのモック（存在する本・登録済みの格言を指定する）
const createDb = ({
  bookExists = true,
  sayings = [],
}: { bookExists?: boolean; sayings?: string[] } = {}) => ({
  selfhelp_book: {
    findFirst: jest.fn().mockResolvedValue(bookExists ? { id: 1 } : null),
  },
  saying: {
    findMany: jest
      .fn()
      .mockResolvedValue(sayings.map((saying) => ({ saying }))),
  },
});

const toParseResult = (data: string[][]) =>
  ({ data, errors: [], meta: {} }) as ParseResult<string[]>;

describe('sayingCsv.validator', () => {
  describe('parseSayingCsvRows', () => {
    it('1行目の出典IDと2行目以降の格言を変換する', () => {
      expect(
        parseSayingCsvRows([['3'], ['格言1', '解説1'], ['格言2', '']]),
      ).toEqual({
        book_id: 3,
        records: [
          { lineNumber: 2, saying: '格言1', explanation: '解説1' },
          { lineNumber: 3, saying: '格言2', explanation: '' },
        ],
        errors: [],
      });
    });

    it('全行のエラーを行番号付きでまとめて返す', () => {
      const { records, errors } = parseSayingCsvRows([
        ['3', ''],
        ['格言1'],
        ['', '解説'],
        ['あ'.repeat(257), '解説'],
      ]);
      expect(records).toEqual([]);
      expect(errors).toEqual([
        '1行目: 出典IDが正しくありません(3,)',
        '2行目: 列数が正しくありません(1列、正しくは2列)',
        '3行目: 格言が空です',
        '4行目: 格言は256文字以内にしてください',
      ]);
    });

    it('格言が1行もなければエラー', () => {
      expect(parseSayingCsvRows([['3']]).errors).toEqual([
        '登録する格言がありません',
      ]);
    });
  });

  describe('checkSayingCsvWithDb', () => {
    const record = (lineNumber: number, saying: string) => ({
      lineNumber,
      saying,
      explanation: '',
    });

    it('本の不在・格言の重複を返す', async () => {
      const db = createDb({ bookExists: false, sayings: ['登録済み'] });
      const errors = await checkSayingCsvWithDb(db as never, 9, [
        record(2, '格言A'),
        record(3, '格言A'),
        record(4, '登録済み'),
      ]);
      expect(errors).toEqual([
        '1行目: 出典ID9の本が存在しません',
        '3行目: 格言が2行目と重複しています',
        '4行目: 同じ格言がすでに登録されています',
      ]);
    });

    it('問題なければエラーなし', async () => {
      expect(
        await checkSayingCsvWithDb(createDb() as never, 1, [
          record(2, '格言A'),
        ]),
      ).toEqual([]);
    });
  });

  describe('validateSayingCsv', () => {
    it('エラーがあれば400でエラー一覧を返す', async () => {
      const promise = validateSayingCsv(
        createDb() as never,
        toParseResult([['abc'], ['格言', '解説']]),
      );
      await expect(promise).rejects.toBeInstanceOf(HttpException);
      await expect(promise).rejects.toMatchObject({
        status: 400,
        response: { errors: ['1行目: 出典IDが正しくありません(abc)'] },
      });
    });

    it('空のCSVはエラーにする', async () => {
      await expect(
        validateSayingCsv(createDb() as never, toParseResult([])),
      ).rejects.toMatchObject({
        response: { errors: ['登録する格言がありません'] },
      });
    });

    it('問題なければ登録用のデータを返す', async () => {
      await expect(
        validateSayingCsv(
          createDb() as never,
          toParseResult([['1'], ['格言', '解説']]),
        ),
      ).resolves.toEqual({
        book_id: 1,
        records: [{ lineNumber: 2, saying: '格言', explanation: '解説' }],
      });
    });
  });
});
