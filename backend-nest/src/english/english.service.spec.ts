import { EnglishService } from './english.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    partsofspeech: {
      findMany: jest.fn(),
    },
    source: {
      findMany: jest.fn(),
    },
    word: {
      findUnique: jest.fn(),
    },
    word_example: {
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
  };
});

describe('EnglishService', () => {
  let englishService: EnglishService;

  beforeEach(() => {
    englishService = new EnglishService();
  });

  // 品詞リスト取得 正常系
  it('getPartsofSpeechService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    (prisma.partsofspeech.findMany as jest.Mock).mockResolvedValueOnce(
      testResult,
    );
    expect(await englishService.getPartsofSpeechService()).toEqual(testResult);
  });

  // 品詞リスト取得 異常系
  it('getPartsofSpeechService - NG', async () => {
    (prisma.partsofspeech.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishService.getPartsofSpeechService(),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 出典リスト取得 正常系
  it('getSourceService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '出典テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    (prisma.source.findMany as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await englishService.getSourceService()).toEqual(testResult);
  });

  // 出典リスト取得 異常系
  it('getSourceService - NG', async () => {
    (prisma.source.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(englishService.getSourceService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 例文追加 正常系
  it('addExampleService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = {
      result: 'Added!',
    };
    (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce(testResult);
    expect(
      await englishService.addExampleService({
        exampleEn: 'Example',
        exampleJa: '例文',
        wordName: 'test',
      }),
    ).toEqual(testResult);
  });

  // 例文追加 異常系
  it('addExampleService - NG', async () => {
    (prisma.word.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishService.addExampleService({
        exampleEn: 'Example',
        exampleJa: '例文',
        wordName: 'test',
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  describe('changeAssociationOfExampleService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    // 例文紐付け 正常系 選択した例文をまとめてトランザクションで紐付ける
    it('changeAssociationOfExampleService - 紐付けOK', async () => {
      (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10 });
      (prisma.word_example.upsert as jest.Mock).mockImplementation(
        (arg) => arg,
      );
      (prisma.$transaction as jest.Mock).mockImplementationOnce(
        async (queries: unknown[]) => queries,
      );
      expect(
        await englishService.changeAssociationOfExampleService({
          wordName: 'test',
          exampleIdList: [1, 2],
          isAssociation: true,
        }),
      ).toEqual({ count: 2 });
      expect(prisma.word_example.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.word_example.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: { example_sentense_id: 2, word_id: 10 },
        }),
      );
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    // 例文紐付け解除 正常系 紐付いている例文だけをまとめて解除する
    it('changeAssociationOfExampleService - 解除OK', async () => {
      (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10 });
      (prisma.word_example.updateMany as jest.Mock).mockResolvedValueOnce({
        count: 1,
      });
      expect(
        await englishService.changeAssociationOfExampleService({
          wordName: 'test',
          exampleIdList: [1, 2],
          isAssociation: false,
        }),
      ).toEqual({ count: 1 });
      expect(prisma.word_example.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            word_id: 10,
            example_sentense_id: { in: [1, 2] },
            deleted_at: null,
          },
        }),
      );
    });

    // 例文紐付け 異常系 単語が存在しない
    it('changeAssociationOfExampleService - 単語なし', async () => {
      (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        englishService.changeAssociationOfExampleService({
          wordName: 'nothing',
          exampleIdList: [1],
          isAssociation: true,
        }),
      ).rejects.toMatchObject({ status: 404 });
    });

    // 例文紐付け 異常系 例文が選択されていない
    it('changeAssociationOfExampleService - 例文なし', async () => {
      await expect(
        englishService.changeAssociationOfExampleService({
          wordName: 'test',
          exampleIdList: [],
          isAssociation: true,
        }),
      ).rejects.toMatchObject({ status: 400 });
    });

    // 例文紐付け 異常系 トランザクションが失敗したら500
    it('changeAssociationOfExampleService - NG', async () => {
      (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10 });
      (prisma.$transaction as jest.Mock).mockRejectedValueOnce(
        new Error('error test by jest.'),
      );
      await expect(
        englishService.changeAssociationOfExampleService({
          wordName: 'test',
          exampleIdList: [1],
          isAssociation: true,
        }),
      ).rejects.toMatchObject({ status: 500, message: 'error test by jest.' });
    });
  });
});
