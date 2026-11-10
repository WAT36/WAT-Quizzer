import { QuizFileService } from './file.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    quiz_file: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    quiz_file_view: {
      findUnique: jest.fn(),
      aggregate: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe('QuizFileService', () => {
  let quizFileService: QuizFileService;

  beforeEach(() => {
    quizFileService = new QuizFileService();
  });

  // ファイル名リスト取得 正常系
  it('getFileList - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 0,
        file_name: '品詞テスト',
        file_nickname: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    (prisma.quiz_file.findMany as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizFileService.getFileList()).toEqual(testResult);
  });

  // ファイル名リスト取得 異常系
  it('getFileList - NG', async () => {
    (prisma.quiz_file.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizFileService.getFileList()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル追加 正常系1
  it('addFile - OK', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    (prisma.quiz_file.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizFileService.addFile(req)).toEqual(testResult);
  });

  // ファイル追加 異常系1
  it('addFile - NG1', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    (prisma.quiz_file.create as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizFileService.addFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル削除 正常系1
  it('deleteFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    (prisma.$transaction as jest.Mock).mockResolvedValue(testResult);
    expect(await quizFileService.deleteFile(req)).toEqual({
      result: 'Deleted.',
    });
  });

  // ファイル削除 異常系1
  it('deleteFile - NG1', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizFileService.deleteFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル統計取得 正常系 進捗率は解答したことのある問題の割合
  it('getFileStatisticsData - OK', async () => {
    (prisma.quiz_file_view.findUnique as jest.Mock).mockResolvedValueOnce({
      file_num: 7,
      file_name: 'test',
      file_nickname: 'テスト',
      count: BigInt(1022),
      clear: 6262,
      fail: 4482,
      not_answered: 0,
      accuracy_rate: 58.3,
    });
    expect(
      await quizFileService.getFileStatisticsData({ file_num: 7 }),
    ).toEqual({
      file_num: 7,
      file_name: 'test',
      file_nickname: 'テスト',
      count: 1022,
      clear: 6262,
      fail: 4482,
      not_answered: 0,
      accuracy_rate: 58.3,
      process_rate: 100,
    });
  });

  // ファイル統計取得 正常系 全ファイル合計
  it('getFileStatisticsData - 全総合', async () => {
    (prisma.quiz_file_view.aggregate as jest.Mock).mockResolvedValueOnce({
      _sum: { count: BigInt(200), clear: 30, fail: 10, not_answered: 150 },
    });
    expect(
      await quizFileService.getFileStatisticsData({ file_num: -1 }),
    ).toMatchObject({
      file_num: -1,
      count: 200,
      accuracy_rate: 75,
      process_rate: 25,
    });
  });

  // ファイル統計取得 正常系 問題が0件なら進捗率0
  it('getFileStatisticsData - 問題0件', async () => {
    (prisma.quiz_file_view.findUnique as jest.Mock).mockResolvedValueOnce({
      file_num: 1,
      count: BigInt(0),
      clear: 0,
      fail: 0,
      not_answered: 0,
      accuracy_rate: 0,
    });
    expect(
      await quizFileService.getFileStatisticsData({ file_num: 1 }),
    ).toMatchObject({ process_rate: 0 });
  });

  // ファイル統計取得 異常系 存在しないファイルは404
  it('getFileStatisticsData - NG', async () => {
    (prisma.quiz_file_view.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await expect(
      quizFileService.getFileStatisticsData({ file_num: 999 }),
    ).rejects.toMatchObject({ status: 404 });
  });
});
