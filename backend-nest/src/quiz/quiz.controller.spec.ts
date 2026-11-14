import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizCsvService } from './csv/quizCsv.service';
import { QuizImageService } from './image/quizImage.service';
import { QuizStatisticsService } from './statistics/quizStatistics.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('QuizController', () => {
  let app: INestApplication;
  const quizService = {
    add: jest.fn(),
    cleared: jest.fn(),
    failed: jest.fn(),
    edit: jest.fn(),
    delete: jest.fn(),
    integrate: jest.fn(),
    addCategoryToQuiz: jest.fn(),
    removeCategoryFromQuiz: jest.fn(),
    check: jest.fn(),
    uncheck: jest.fn(),
    reverseCheck: jest.fn(),
    deleteAnswerLogByFile: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        { provide: QuizService, useValue: quizService },
        { provide: QuizCsvService, useValue: {} },
        { provide: QuizImageService, useValue: {} },
        { provide: QuizStatisticsService, useValue: {} },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
      ],
    })
      .overrideGuard(CognitoAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    Object.values(quizService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({ id: 1 });
    });
  });

  describe('POST /quiz (問題追加)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      // 画面の初期値(initAddQuizRequestData)に入力した状態
      const body = {
        file_num: 1,
        format_id: 1,
        question: '問題文',
        answer: '答え',
        category: '',
        dummyChoice: [
          { sentense: '', isCorrect: false },
          { sentense: '', isCorrect: false },
          { sentense: '', isCorrect: false },
        ],
      };
      await request(app.getHttpServer()).post('/quiz').send(body).expect(201);
      expect(quizService.add).toHaveBeenCalledWith(body);
    });

    it('スキーマにない項目は取り除いてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .send({ file_num: 1, question: 'Q', answer: 'A', unknown: 'x' })
        .expect(201);
      expect(quizService.add).toHaveBeenCalledWith({
        file_num: 1,
        question: 'Q',
        answer: 'A',
      });
    });

    it.each([
      ['file_numがない', { question: 'Q', answer: 'A' }],
      ['file_numが文字列', { file_num: '1', question: 'Q', answer: 'A' }],
      ['file_numが-1(未選択)', { file_num: -1, question: 'Q', answer: 'A' }],
      ['format_idが文字列', { file_num: 1, format_id: '1', question: 'Q' }],
      ['問題文が数値', { file_num: 1, question: 1, answer: 'A' }],
      [
        'ダミー選択肢の形が違う',
        { file_num: 1, format_id: 3, dummyChoice: ['ダミー'] },
      ],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      const res = await request(app.getHttpServer())
        .post('/quiz')
        .send(body)
        .expect(400);
      expect(typeof res.body.message).toBe('string');
      expect(quizService.add).not.toHaveBeenCalled();
    });

    it('400のmessageに不正な項目名が入る', async () => {
      const res = await request(app.getHttpServer())
        .post('/quiz')
        .send({ file_num: '1', question: 'Q', answer: 'A' })
        .expect(400);
      expect(res.body.message).toMatch(/^file_num: /);
    });
  });

  // 問題追加以外の書き込み系API
  // valid: 画面から送られる形のデータ、invalids: 400にすべきデータ
  type Method = 'post' | 'put' | 'patch' | 'delete';
  const endpoints: {
    name: string;
    method: Method;
    path: string;
    service: keyof typeof quizService;
    valid: object;
    invalids: [string, unknown][];
  }[] = [
    {
      name: '正解登録',
      method: 'post',
      path: '/quiz/clear',
      service: 'cleared',
      valid: { quiz_id: 1 },
      invalids: [
        ['quiz_idがない', {}],
        ['quiz_idが文字列', { quiz_id: '1' }],
        ['quiz_idが小数', { quiz_id: 1.5 }],
      ],
    },
    {
      name: '不正解登録',
      method: 'post',
      path: '/quiz/fail',
      service: 'failed',
      valid: { quiz_id: 1 },
      invalids: [
        ['quiz_idがない', {}],
        ['quiz_idが0', { quiz_id: 0 }],
      ],
    },
    {
      name: '問題編集',
      method: 'post',
      path: '/quiz/edit',
      service: 'edit',
      // 問題取得APIの値を編集画面に入れた形（画像なしはnull）
      valid: {
        quiz_id: 10,
        file_num: 1,
        quiz_num: 2,
        format_id: 1,
        question: '問題文',
        answer: '答え',
        category: 'カテゴリ',
        img_file: null,
        matched_basic_quiz_id: '',
        dummyChoice: [],
      },
      invalids: [
        ['quiz_idがない', { file_num: 1, quiz_num: 2 }],
        ['quiz_numがない', { quiz_id: 10, file_num: 1 }],
        ['quiz_numが-1(未選択)', { quiz_id: 10, file_num: 1, quiz_num: -1 }],
        [
          'img_fileが数値',
          { quiz_id: 10, file_num: 1, quiz_num: 2, img_file: 1 },
        ],
      ],
    },
    {
      name: '問題削除',
      method: 'delete',
      path: '/quiz',
      service: 'delete',
      valid: { file_num: 1, quiz_num: 2 },
      invalids: [
        ['quiz_numがない', { file_num: 1 }],
        ['file_numが文字列', { file_num: '1', quiz_num: 2 }],
      ],
    },
    {
      name: '問題統合',
      method: 'post',
      path: '/quiz/integrate',
      service: 'integrate',
      valid: { fromQuizId: 1, toQuizId: 2 },
      invalids: [
        ['toQuizIdがない', { fromQuizId: 1 }],
        ['fromQuizIdが文字列', { fromQuizId: '1', toQuizId: 2 }],
      ],
    },
    {
      name: '問題にカテゴリ追加',
      method: 'post',
      path: '/quiz/category',
      service: 'addCategoryToQuiz',
      valid: { quiz_ids: [1, 2], category: 'カテゴリ' },
      invalids: [
        ['quiz_idsが空', { quiz_ids: [], category: 'カテゴリ' }],
        ['quiz_idsに文字列', { quiz_ids: [1, '2'], category: 'カテゴリ' }],
        ['categoryが空', { quiz_ids: [1], category: '' }],
        ['categoryがない', { quiz_ids: [1] }],
      ],
    },
    {
      name: '問題からカテゴリ削除',
      method: 'put',
      path: '/quiz/category',
      service: 'removeCategoryFromQuiz',
      valid: { quiz_ids: [1, 2], category: 'カテゴリ' },
      invalids: [
        ['quiz_idsが配列でない', { quiz_ids: 1, category: 'カテゴリ' }],
        ['categoryが空', { quiz_ids: [1], category: '' }],
      ],
    },
    {
      name: 'チェックを付ける',
      method: 'put',
      path: '/quiz/check',
      service: 'check',
      valid: { quiz_ids: [1, 2] },
      invalids: [
        ['quiz_idsがない', {}],
        ['quiz_idsが空', { quiz_ids: [] }],
        ['quiz_idsに小数', { quiz_ids: [1.5] }],
      ],
    },
    {
      name: 'チェックを外す',
      method: 'put',
      path: '/quiz/uncheck',
      service: 'uncheck',
      valid: { quiz_ids: [1] },
      invalids: [['quiz_idsが空', { quiz_ids: [] }]],
    },
    {
      name: 'チェック反転',
      method: 'post',
      path: '/quiz/check',
      service: 'reverseCheck',
      valid: { quiz_id: 1 },
      invalids: [
        ['quiz_idがない', {}],
        ['quiz_idが文字列', { quiz_id: 'abc' }],
      ],
    },
    {
      name: 'ファイル単位の解答履歴削除',
      method: 'patch',
      path: '/quiz/answer_log/file',
      service: 'deleteAnswerLogByFile',
      valid: { file_id: 1 },
      invalids: [
        ['file_idがない', {}],
        ['file_idが-1(未選択)', { file_id: -1 }],
      ],
    },
  ];

  describe.each(endpoints)(
    '$method $path ($name)',
    ({ method, path, service, valid, invalids }) => {
      it('画面から送られる形のデータはサービスに渡る', async () => {
        const res = await request(app.getHttpServer())
          [method](path)
          .send(valid);
        expect(res.status).toBeLessThan(300);
        expect(quizService[service]).toHaveBeenCalledWith(valid);
      });

      it.each(invalids)('%sなら400でサービスを呼ばない', async (_, body) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .send(body as object)
          .expect(400);
        expect(typeof res.body.message).toBe('string');
        expect(quizService[service]).not.toHaveBeenCalled();
      });
    },
  );
});
