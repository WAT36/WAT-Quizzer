import { QuizCsvService } from './quizCsv.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    quiz: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      createManyAndReturn: jest.fn(),
    },
    quiz_file: { findMany: jest.fn() },
    quiz_explanation: { createMany: jest.fn() },
    quiz_dummy_choice: { createMany: jest.fn() },
    category: {
      createMany: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    category_quiz: { createMany: jest.fn() },
  };
  return {
    prisma: mockPrisma,
    containsAny: jest.requireActual('quizzer-lib').containsAny,
    // CSVの読み込み(parseCsv)で使う
    removeNullChars: jest.requireActual('quizzer-lib').removeNullChars,
  };
});

describe('QuizCsvService', () => {
  let quizCsvService: QuizCsvService;

  beforeEach(() => {
    quizCsvService = new QuizCsvService();
  });
  // 四択問題CSV登録 正常系 ファイルごとに問題番号を振り、答えの数に応じて正解を設定する
  it('uploadFourChoiceFile - OK', async () => {
    const file = {
      buffer: Buffer.from(
        '1,2,問題文1,答え,D1,D2,D3,解説,カテゴリA:カテゴリB\n1,1,問題文2,答え,E1,E2,E3,,カテゴリA\n',
      ),
    } as Express.Multer.File;
    // バリデーション
    (prisma.quiz_file.findMany as jest.Mock).mockResolvedValueOnce([
      { file_num: 1 },
    ]);
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([]);
    // 登録
    (prisma.$transaction as jest.Mock).mockImplementationOnce((callback) =>
      callback(prisma),
    );
    (prisma.quiz.groupBy as jest.Mock).mockResolvedValueOnce([
      { file_num: 1, _max: { quiz_num: 10 } },
    ]);
    (prisma.category.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'カテゴリA', file_num: 1 },
      { id: 2, name: 'カテゴリB', file_num: 1 },
    ]);
    (prisma.quiz.createManyAndReturn as jest.Mock).mockResolvedValueOnce([
      { id: 101, quiz_sentense: '問題文1' },
      { id: 102, quiz_sentense: '問題文2' },
    ]);
    [
      prisma.category.createMany,
      prisma.category.updateMany,
      prisma.quiz_explanation.createMany,
      prisma.quiz_dummy_choice.createMany,
      prisma.category_quiz.createMany,
    ].forEach((fn) => (fn as jest.Mock).mockClear());

    expect(await quizCsvService.uploadFourChoiceFile(file)).toEqual({
      result: 'All Registered!!',
    });
    // 登録済みの最大値の次から問題番号を振る
    expect(
      (prisma.quiz.createManyAndReturn as jest.Mock).mock.calls[0][0].data,
    ).toEqual([
      expect.objectContaining({
        format_id: 3,
        file_num: 1,
        quiz_num: 11,
        quiz_sentense: '問題文1',
      }),
      expect.objectContaining({ quiz_num: 12, quiz_sentense: '問題文2' }),
    ]);
    // カテゴリはファイル内で重複なくまとめて登録する
    expect(prisma.category.createMany).toHaveBeenCalledWith({
      data: [
        { name: 'カテゴリA', file_num: 1 },
        { name: 'カテゴリB', file_num: 1 },
      ],
      skipDuplicates: true,
    });
    // 解説は空欄の問題を除いて登録する
    expect(prisma.quiz_explanation.createMany).toHaveBeenCalledWith({
      data: [{ quiz_id: 101, explanation: '解説' }],
    });
    // 答えの数に応じてダミー選択肢1から順に正解にする
    expect(prisma.quiz_dummy_choice.createMany).toHaveBeenCalledWith({
      data: [
        { quiz_id: 101, dummy_choice_sentense: 'D1', is_corrected: true },
        { quiz_id: 101, dummy_choice_sentense: 'D2', is_corrected: false },
        { quiz_id: 101, dummy_choice_sentense: 'D3', is_corrected: false },
        { quiz_id: 102, dummy_choice_sentense: 'E1', is_corrected: false },
        { quiz_id: 102, dummy_choice_sentense: 'E2', is_corrected: false },
        { quiz_id: 102, dummy_choice_sentense: 'E3', is_corrected: false },
      ],
    });
    expect(prisma.category_quiz.createMany).toHaveBeenCalledWith({
      data: [
        { quiz_id: 101, category_id: 1 },
        { quiz_id: 101, category_id: 2 },
        { quiz_id: 102, category_id: 1 },
      ],
    });
  });

  // 問題CSV登録 異常系 バリデーションエラーは登録せず400で返す
  it('uploadFile - NG validation', async () => {
    const file = {
      buffer: Buffer.from('3,1,問題文,答え,,,\n'),
    } as Express.Multer.File;
    (prisma.$transaction as jest.Mock).mockClear();
    await expect(quizCsvService.uploadFile(file)).rejects.toMatchObject({
      status: 400,
      response: {
        errors: ['1行目: 問題形式は1(基礎)か2(応用)にしてください(3)'],
      },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
