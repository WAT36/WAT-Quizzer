import { EnglishWordService } from './word.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    word: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    mean: {
      create: jest.fn(),
      update: jest.fn(),
    },
    derivative: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    derivative_group: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
  };
});

describe('EnglishWordService', () => {
  let englishWordService: EnglishWordService;

  beforeEach(() => {
    englishWordService = new EnglishWordService();
  });

  // 単語と意味追加 正常系
  it('addWordAndMeanService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = { result: 'Added!!' };
    (prisma.$transaction as jest.Mock).mockResolvedValue(testResult);
    expect(
      await englishWordService.addWordAndMeanService({
        inputWord: {
          wordName: 'testWord',
          sourceId: 1,
          subSourceName: 'subsourcetest',
        },
        pronounce: 'testPronounce',
        meanArrayData: [],
      }),
    ).toEqual(testResult);
  });

  // 単語と意味追加 異常系
  it('addWordAndMeanService - NG', async () => {
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishWordService.addWordAndMeanService({
        inputWord: {
          wordName: 'testWord',
          sourceId: 1,
          subSourceName: 'subsourcetest',
        },
        pronounce: 'testPronounce',
        meanArrayData: [],
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語検索 正常系
  it('searchWordService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    (prisma.word.findMany as jest.Mock).mockResolvedValue(testResult);
    expect(
      await englishWordService.searchWordService({ wordName: 'searchWord' }),
    ).toEqual(testResult);
  });

  // 単語検索 異常系
  it('searchWordService - NG', async () => {
    (prisma.word.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishWordService.searchWordService({ wordName: 'searchWord' }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語全取得 正常系
  it('getAllWordService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    (prisma.word.findMany as jest.Mock).mockResolvedValue(testResult);
    expect(await englishWordService.getAllWordService()).toEqual(testResult);
  });

  // 単語全取得 異常系
  it('getAllWordService - NG', async () => {
    (prisma.word.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(englishWordService.getAllWordService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // IDから単語情報取得 正常系
  it('getWordByIdService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    (prisma.word.findUnique as jest.Mock).mockResolvedValue(testResult);
    expect(await englishWordService.getWordByIdService(0)).toEqual(testResult);
  });

  // IDから単語情報取得 異常系
  it('getWordByIdService - NG', async () => {
    (prisma.word.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishWordService.getWordByIdService(0),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語名から単語情報取得 正常系
  it('getWordByNameService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    (prisma.word.findMany as jest.Mock).mockResolvedValue(testResult);
    expect(await englishWordService.getWordByNameService('test')).toEqual(
      testResult,
    );
  });

  // 単語名から単語情報取得 異常系
  it('getWordByNameService - NG', async () => {
    (prisma.word.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishWordService.getWordByNameService('test'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 単語の意味などを更新 正常系
  it('editWordMeanService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'test',
      },
    ];
    (prisma.mean.create as jest.Mock).mockResolvedValue(testResult);
    (prisma.mean.update as jest.Mock).mockResolvedValue(testResult);
    expect(
      await englishWordService.editWordMeanService({
        wordId: 0,
        wordMeanId: 0,
        meanId: 0,
        partofspeechId: 0,
        meaning: '意味テスト',
      }),
    ).toEqual(testResult);
  });

  // 単語の意味などを更新 異常系
  it('editWordMeanService - NG', async () => {
    (prisma.mean.create as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    (prisma.mean.update as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishWordService.editWordMeanService({
        wordId: 0,
        wordMeanId: 0,
        meanId: 0,
        partofspeechId: 0,
        meaning: '意味テスト',
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 派生語追加
  describe('addDerivativeService', () => {
    const req = { wordName: 'act', derivativeName: 'active' };
    // 元単語・派生語の検索結果を順に返す。groupIdがnullならグループに属していない
    const mockWords = (
      word: { id: number; groupId: number | null } | null,
      derivative: { id: number; groupId: number | null } | null,
    ) => {
      const toData = (x: { id: number; groupId: number | null } | null) =>
        x && {
          id: x.id,
          derivative: x.groupId ? { derivative_group_id: x.groupId } : null,
        };
      (prisma.word.findFirst as jest.Mock)
        .mockResolvedValueOnce(toData(word))
        .mockResolvedValueOnce(toData(derivative));
    };

    beforeEach(() => {
      [
        prisma.word.findFirst,
        prisma.derivative.create,
        prisma.derivative.updateMany,
        prisma.derivative_group.create,
        prisma.derivative_group.delete,
      ].forEach((fn) => (fn as jest.Mock).mockReset());
      (prisma.$transaction as jest.Mock).mockReset();
      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn(prisma),
      );
    });

    it('どちらもグループに属していない場合、グループを作って両方登録する', async () => {
      mockWords({ id: 1, groupId: null }, { id: 2, groupId: null });
      (prisma.derivative_group.create as jest.Mock).mockResolvedValue({
        id: 10,
      });
      await englishWordService.addDerivativeService(req);
      expect(prisma.derivative_group.create).toHaveBeenCalledWith({
        data: { derivative_group_name: 'act' },
      });
      expect(prisma.derivative.create).toHaveBeenNthCalledWith(1, {
        data: { derivative_group_id: 10, word_id: 1 },
      });
      expect(prisma.derivative.create).toHaveBeenNthCalledWith(2, {
        data: { derivative_group_id: 10, word_id: 2 },
      });
    });

    it('元単語だけグループに属している場合、そのグループに派生語を登録する', async () => {
      mockWords({ id: 1, groupId: 10 }, { id: 2, groupId: null });
      await englishWordService.addDerivativeService(req);
      expect(prisma.derivative.create).toHaveBeenCalledTimes(1);
      expect(prisma.derivative.create).toHaveBeenCalledWith({
        data: { derivative_group_id: 10, word_id: 2 },
      });
      expect(prisma.derivative_group.create).not.toHaveBeenCalled();
    });

    it('派生語だけグループに属している場合、そのグループに元単語を登録する', async () => {
      mockWords({ id: 1, groupId: null }, { id: 2, groupId: 20 });
      await englishWordService.addDerivativeService(req);
      expect(prisma.derivative.create).toHaveBeenCalledTimes(1);
      expect(prisma.derivative.create).toHaveBeenCalledWith({
        data: { derivative_group_id: 20, word_id: 1 },
      });
      expect(prisma.derivative_group.create).not.toHaveBeenCalled();
    });

    it('別々のグループに属している場合、派生語側のグループを元単語のグループに統合する', async () => {
      mockWords({ id: 1, groupId: 10 }, { id: 2, groupId: 20 });
      await englishWordService.addDerivativeService(req);
      expect(prisma.derivative.updateMany).toHaveBeenCalledWith({
        data: { derivative_group_id: 10 },
        where: { derivative_group_id: 20 },
      });
      expect(prisma.derivative_group.delete).toHaveBeenCalledWith({
        where: { id: 20 },
      });
      expect(prisma.derivative.create).not.toHaveBeenCalled();
    });

    it('すでに同じグループに属している場合、400エラーにして登録しない', async () => {
      mockWords({ id: 1, groupId: 10 }, { id: 2, groupId: 10 });
      await expect(
        englishWordService.addDerivativeService(req),
      ).rejects.toMatchObject({
        message: '入力単語(active)はすでに派生語として登録されています',
        status: 400,
      });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('元単語と同じ単語を指定した場合、400エラーにして登録しない', async () => {
      mockWords({ id: 1, groupId: null }, { id: 1, groupId: null });
      await expect(
        englishWordService.addDerivativeService(req),
      ).rejects.toMatchObject({ status: 400 });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('元単語が存在しない場合、400エラーにする', async () => {
      mockWords(null, { id: 2, groupId: null });
      await expect(
        englishWordService.addDerivativeService(req),
      ).rejects.toMatchObject({
        message: '元単語(act)は存在しません',
        status: 400,
      });
    });

    it('派生語が存在しない場合、400エラーにする', async () => {
      mockWords({ id: 1, groupId: null }, null);
      await expect(
        englishWordService.addDerivativeService(req),
      ).rejects.toMatchObject({
        message: '入力単語(active)は存在しません',
        status: 400,
      });
    });
  });
});
