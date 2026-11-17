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
  const quizStatisticsService = {
    getAnswerLogStatistics: jest.fn(),
    getAccuracyRateHistgramData: jest.fn(),
    getRecommendedCategories: jest.fn(),
  };
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
    getQuiz: jest.fn(),
    search: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        { provide: QuizService, useValue: quizService },
        { provide: QuizCsvService, useValue: {} },
        { provide: QuizImageService, useValue: {} },
        { provide: QuizStatisticsService, useValue: quizStatisticsService },
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
    Object.values(quizStatisticsService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue([]);
    });
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
      [
        '四択問題でダミー選択肢がない',
        { file_num: 1, format_id: 3, question: 'Q', answer: 'A' },
      ],
      [
        '四択問題でダミー選択肢が3つ未満',
        {
          file_num: 1,
          format_id: 3,
          question: 'Q',
          answer: 'A',
          dummyChoice: [
            { sentense: 'ダミー1', isCorrect: false },
            { sentense: 'ダミー2', isCorrect: false },
          ],
        },
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
        ['quiz_idsに小数', { quiz_ids: [1.5], category: 'カテゴリ' }],
        [
          'quiz_idsがカンマ区切りの文字列',
          { quiz_ids: '1,2', category: 'カテゴリ' },
        ],
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
        ['quiz_idsが空', { quiz_ids: [], category: 'カテゴリ' }],
        ['quiz_idsに文字列', { quiz_ids: ['1'], category: 'カテゴリ' }],
        ['quiz_idsに小数', { quiz_ids: [1.5], category: 'カテゴリ' }],
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
        ['quiz_idsに文字列', { quiz_ids: ['1'] }],
        ['quiz_idsがカンマ区切りの文字列', { quiz_ids: '1,2' }],
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
        ['quiz_idが数字の文字列', { quiz_id: '1' }],
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

  describe('GET /quiz/statistics (解答数統計)', () => {
    it.each([
      // 画面は未選択・未指定の値を送らないか-1を送る
      ['未指定なら全ファイル・日単位', '', { file_num: -1, date_unit: 'day' }],
      [
        'file_numが-1なら全ファイル',
        '?file_num=-1',
        { file_num: -1, date_unit: 'day' },
      ],
      [
        'ファイルと単位を指定',
        '?file_num=2&date_unit=week',
        { file_num: 2, date_unit: 'week' },
      ],
    ])('%s', async (_, query, expected) => {
      await request(app.getHttpServer())
        .get('/quiz/statistics' + query)
        .expect(200);
      expect(quizStatisticsService.getAnswerLogStatistics).toHaveBeenCalledWith(
        expected,
      );
    });

    it.each([
      ['file_numが数値でない', '?file_num=abc'],
      ['file_numが0', '?file_num=0'],
      ['date_unitが定義外', '?date_unit=year'],
    ])('%sなら400でサービスを呼ばない', async (_, query) => {
      await request(app.getHttpServer())
        .get('/quiz/statistics' + query)
        .expect(400);
      expect(
        quizStatisticsService.getAnswerLogStatistics,
      ).not.toHaveBeenCalled();
    });
  });

  describe('GET /quiz (問題取得)', () => {
    it.each([
      [
        // 番号指定で取得（画面の初期値: 形式なし・キーワード対象は問題文と答え）
        '番号指定',
        '/quiz?file_num=1&quiz_num=2&format_id=&keywordTarget=sentence_answer',
        { file_num: 1, quiz_num: 2, keywordTarget: 'sentence_answer' },
        undefined,
      ],
      [
        '出題方法と条件をすべて指定',
        '/quiz/random?file_num=1&quiz_num=-1&format_id=1,3&min_rate=0&max_rate=90&category=A,B&checked=true&keyword=k&keywordTarget=explanation&count=5',
        {
          file_num: 1,
          format_id: [1, 3],
          min_rate: 0,
          max_rate: 90,
          category: 'A,B',
          checked: true,
          keyword: 'k',
          keywordTarget: 'explanation',
          count: 5,
        },
        'random',
      ],
      [
        '未選択(-1)のカテゴリ・正解率は指定なしにする',
        '/quiz/lru?file_num=1&category=-1&max_rate=-1',
        { file_num: 1 },
        'LRU',
      ],
    ])('%s', async (_, url, expected, method) => {
      await request(app.getHttpServer()).get(url).expect(200);
      expect(quizService.getQuiz).toHaveBeenCalledWith(
        expected,
        ...(method ? [method] : []),
      );
    });

    it.each([
      ['ファイル番号がない', '/quiz?quiz_num=1'],
      ['ファイル番号が-1(未選択)', '/quiz/random?file_num=-1'],
      ['問題番号が数値でない', '/quiz?file_num=1&quiz_num=x'],
      ['問題形式IDが数値でない', '/quiz/random?file_num=1&format_id=1,abc'],
      ['checkedがtrue/false以外', '/quiz/random?file_num=1&checked=yes'],
      ['正解率が100より大きい', '/quiz/worst?file_num=1&max_rate=101'],
      ['出題数が0', '/quiz/random?file_num=1&count=0'],
      ['キーワード対象が定義外', '/quiz/random?file_num=1&keywordTarget=x'],
    ])('%sなら400でサービスを呼ばない', async (_, url) => {
      await request(app.getHttpServer()).get(url).expect(400);
      expect(quizService.getQuiz).not.toHaveBeenCalled();
    });
  });

  describe('GET /quiz/search (問題検索)', () => {
    it('画面で条件を指定した形のクエリを変換してサービスに渡す', async () => {
      const query = new URLSearchParams({
        query: 'キーワード',
        file_num: '1',
        format_id: '2,1',
        min_rate: '0',
        max_rate: '100',
        category_and: JSON.stringify([' A ', 'A', '', 'B,C']),
        category_not: JSON.stringify(['E']),
        checked: 'false',
        searchInOnlySentense: 'true',
        searchInOnlyAnswer: 'false',
        searchInExplanation: 'false',
        onlyDirectCategory: 'true',
        result_from: '1',
        result_to: '20',
      });
      await request(app.getHttpServer())
        .get('/quiz/search?' + query.toString())
        .expect(200);
      expect(quizService.search).toHaveBeenCalledWith({
        query: 'キーワード',
        file_num: 1,
        format_id: [2, 1],
        min_rate: 0,
        max_rate: 100,
        category_and: ['A', 'B,C'],
        category_not: ['E'],
        checked: false,
        searchInOnlySentense: true,
        searchInOnlyAnswer: false,
        searchInExplanation: false,
        onlyDirectCategory: true,
        result_from: 1,
        result_to: 20,
      });
    });

    it('キーワード・条件なしなら空のキーワードで検索する', async () => {
      await request(app.getHttpServer())
        .get('/quiz/search?file_num=1&format_id=')
        .expect(200);
      expect(quizService.search).toHaveBeenCalledWith({
        query: '',
        file_num: 1,
      });
    });

    it.each([
      ['ファイル番号がない', 'query=a'],
      ['カテゴリ条件がJSONでない', 'file_num=1&category_and=not%20json'],
      [
        'カテゴリ条件が配列でない',
        'file_num=1&category_not=' + encodeURIComponent('"A"'),
      ],
      [
        'カテゴリ条件に文字列以外',
        'file_num=1&category_not=' + encodeURIComponent('["A",1]'),
      ],
      ['onlyDirectCategoryがtrue/false以外', 'file_num=1&onlyDirectCategory=1'],
      ['件数の開始が数値でない', 'file_num=1&result_from=abc'],
    ])('%sなら400でサービスを呼ばない', async (_, query) => {
      await request(app.getHttpServer())
        .get('/quiz/search?' + query)
        .expect(400);
      expect(quizService.search).not.toHaveBeenCalled();
    });
  });

  describe('GET /quiz/statistics/histgram (正答率ヒストグラム)', () => {
    it.each([
      ['未指定なら全ファイル(-1)', '', -1],
      ['-1なら全ファイル', '?file_num=-1', -1],
      ['ファイルを指定', '?file_num=2', 2],
    ])('%s', async (_, query, file_num) => {
      await request(app.getHttpServer())
        .get('/quiz/statistics/histgram' + query)
        .expect(200);
      expect(
        quizStatisticsService.getAccuracyRateHistgramData,
      ).toHaveBeenCalledWith(file_num);
    });

    it('file_numが数値でなければ400', async () => {
      await request(app.getHttpServer())
        .get('/quiz/statistics/histgram?file_num=abc')
        .expect(400);
      expect(
        quizStatisticsService.getAccuracyRateHistgramData,
      ).not.toHaveBeenCalled();
    });
  });

  describe('GET /quiz/recommend-categories (おすすめカテゴリ)', () => {
    it('ファイル番号を数値にして渡す', async () => {
      await request(app.getHttpServer())
        .get('/quiz/recommend-categories?file_num=2')
        .expect(200);
      expect(
        quizStatisticsService.getRecommendedCategories,
      ).toHaveBeenCalledWith(2);
    });

    it.each([
      ['ない', ''],
      ['-1(未選択)', '?file_num=-1'],
      ['数値でない', '?file_num=abc'],
    ])('ファイル番号が%sなら400', async (_, query) => {
      await request(app.getHttpServer())
        .get('/quiz/recommend-categories' + query)
        .expect(400);
      expect(
        quizStatisticsService.getRecommendedCategories,
      ).not.toHaveBeenCalled();
    });
  });

  describe('問題へのカテゴリ追加・削除のカテゴリ名の前後の空白(全角を含む)', () => {
    it('前後の空白を除いてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/quiz/category')
        .send({ quiz_ids: [1], category: ' JavaScript\u3000' })
        .expect(201);
      expect(quizService.addCategoryToQuiz).toHaveBeenCalledWith({
        quiz_ids: [1],
        category: 'JavaScript',
      });
    });

    it.each([
      ['post', 'addCategoryToQuiz'],
      ['put', 'removeCategoryFromQuiz'],
    ] as const)(
      '%s /quiz/category でカテゴリが空白だけなら400',
      async (method, svc) => {
        await request(app.getHttpServer())
          [method]('/quiz/category')
          .send({ quiz_ids: [1], category: '\u3000 ' })
          .expect(400);
        expect(quizService[svc]).not.toHaveBeenCalled();
      },
    );
  });

  describe('カンマ区切りのカテゴリ名', () => {
    const messy = ' JavaScript ,\u3000, 非同期処理\u3000,JavaScript,';

    it('問題追加では、各カテゴリ名の前後の空白と空のもの・重複を除いて渡す', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .send({
          file_num: 1,
          format_id: 1,
          question: 'Q',
          answer: 'A',
          category: messy,
        })
        .expect(201);
      expect(quizService.add).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'JavaScript,非同期処理' }),
      );
    });

    it('問題編集でも同じように整えて渡し、カテゴリが空白とカンマだけなら空にする', async () => {
      const body = {
        quiz_id: 10,
        file_num: 1,
        quiz_num: 2,
        question: 'Q',
        answer: 'A',
      };
      await request(app.getHttpServer())
        .post('/quiz/edit')
        .send({ ...body, category: messy })
        .expect(201);
      expect(quizService.edit).toHaveBeenLastCalledWith(
        expect.objectContaining({ category: 'JavaScript,非同期処理' }),
      );

      await request(app.getHttpServer())
        .post('/quiz/edit')
        .send({ ...body, category: ' , \u3000,' })
        .expect(201);
      expect(quizService.edit).toHaveBeenLastCalledWith(
        expect.objectContaining({ category: '' }),
      );
    });

    it('問題へのカテゴリ追加でも同じように整えて渡す', async () => {
      await request(app.getHttpServer())
        .post('/quiz/category')
        .send({ quiz_ids: [1], category: messy })
        .expect(201);
      expect(quizService.addCategoryToQuiz).toHaveBeenCalledWith({
        quiz_ids: [1],
        category: 'JavaScript,非同期処理',
      });
    });

    it.each([
      ['post', 'addCategoryToQuiz'],
      ['put', 'removeCategoryFromQuiz'],
    ] as const)(
      '%s /quiz/category でカテゴリが空白とカンマだけなら400',
      async (method, svc) => {
        await request(app.getHttpServer())
          [method]('/quiz/category')
          .send({ quiz_ids: [1], category: ' ,\u3000,' })
          .expect(400);
        expect(quizService[svc]).not.toHaveBeenCalled();
      },
    );
  });

  describe('四択問題のダミー選択肢の文', () => {
    const dummies = (second: string) => [
      { sentense: ' ダミー1 ', isCorrect: false },
      { sentense: second, isCorrect: true },
      { sentense: 'ダミー3', isCorrect: false },
    ];
    const addBody = { file_num: 1, format_id: 3, question: 'Q', answer: 'A' };
    const editBody = { ...addBody, quiz_id: 10, quiz_num: 2 };

    it.each([
      ['問題追加', '/quiz', addBody, 'add'],
      ['問題編集', '/quiz/edit', editBody, 'edit'],
    ] as const)(
      '%sで空・空白だけのダミー選択肢があれば、何番目かを示して400',
      async (_, path, body, svc) => {
        for (const second of ['', ' \u3000']) {
          const res = await request(app.getHttpServer())
            .post(path)
            .send({ ...body, dummyChoice: dummies(second) })
            .expect(400);
          expect(res.body.message).toContain('ダミー選択肢2を入力してください');
        }
        expect(quizService[svc]).not.toHaveBeenCalled();
      },
    );

    it('ダミー選択肢の文は前後の空白を除いて渡す', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .send({ ...addBody, dummyChoice: dummies('ダミー2\u3000') })
        .expect(201);
      expect(quizService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          dummyChoice: [
            { sentense: 'ダミー1', isCorrect: false },
            { sentense: 'ダミー2', isCorrect: true },
            { sentense: 'ダミー3', isCorrect: false },
          ],
        }),
      );
    });

    it('四択以外では、画面の初期値の空のダミー選択肢があってもよい', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .send({ ...addBody, format_id: 1, dummyChoice: dummies('') })
        .expect(201);
    });
  });
});
