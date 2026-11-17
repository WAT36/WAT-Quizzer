import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { EnglishController } from './english.controller';
import { EnglishService } from './english.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('EnglishController', () => {
  let app: INestApplication;
  const englishService = {
    addExampleService: jest.fn(),
    changeAssociationOfExampleService: jest.fn(),
    exampleTestClearedService: jest.fn(),
    exampleTestFailedService: jest.fn(),
    registerWordsToSource: jest.fn(),
    getExampleTestService: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EnglishController],
      providers: [
        { provide: EnglishService, useValue: englishService },
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
    Object.values(englishService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({});
    });
  });

  type Method = 'post';
  const endpoints: {
    name: string;
    method: Method;
    path: string;
    service: keyof typeof englishService;
    valids: [string, object][];
    invalids: [string, unknown][];
  }[] = [
    {
      name: '例文追加',
      method: 'post',
      path: '/english/example',
      service: 'addExampleService',
      valids: [
        // 画面の初期値に例文を入力した状態
        [
          '単語・出典なし',
          {
            exampleEn: 'I eat.',
            exampleJa: '食べる',
            wordName: '',
            sourceId: -1,
          },
        ],
        [
          '単語と出典を指定',
          {
            exampleEn: 'I eat.',
            exampleJa: '食べる',
            explanation: '解説',
            wordName: 'eat',
            sourceId: 3,
          },
        ],
        [
          '出典がその他(-2)で名前を入力',
          {
            exampleEn: 'I eat.',
            exampleJa: '食べる',
            sourceId: -2,
            newSourceName: '新しい出典',
          },
        ],
      ],
      invalids: [
        ['英文が空', { exampleEn: '', exampleJa: '食べる' }],
        ['和文がない', { exampleEn: 'I eat.' }],
        [
          '出典がその他(-2)で名前がない',
          { exampleEn: 'I eat.', exampleJa: '食べる', sourceId: -2 },
        ],
        [
          '出典IDが文字列',
          { exampleEn: 'I eat.', exampleJa: '食べる', sourceId: '3' },
        ],
      ],
    },
    {
      name: '例文の紐付け変更',
      method: 'post',
      path: '/english/example/association',
      service: 'changeAssociationOfExampleService',
      valids: [
        [
          '紐付け',
          { wordName: 'eat', exampleIdList: [1, 2], isAssociation: true },
        ],
        [
          '紐付け解除',
          { wordName: 'eat', exampleIdList: [1], isAssociation: false },
        ],
      ],
      invalids: [
        [
          '例文が未選択',
          { wordName: 'eat', exampleIdList: [], isAssociation: true },
        ],
        ['単語が空', { wordName: '', exampleIdList: [1], isAssociation: true }],
        [
          'isAssociationが文字列',
          { wordName: 'eat', exampleIdList: [1], isAssociation: 'true' },
        ],
      ],
    },
    {
      name: '例文テスト正解登録',
      method: 'post',
      path: '/english/example/test/clear',
      service: 'exampleTestClearedService',
      valids: [['英作文テスト(1)', { exampleId: 1, testType: 1 }]],
      invalids: [
        ['testTypeが定義外(0)', { exampleId: 1, testType: 0 }],
        ['exampleIdがない', { testType: 1 }],
      ],
    },
    {
      name: '例文テスト不正解登録',
      method: 'post',
      path: '/english/example/test/fail',
      service: 'exampleTestFailedService',
      valids: [['英作文テスト(1)', { exampleId: 1, testType: 1 }]],
      invalids: [['exampleIdが文字列', { exampleId: '1', testType: 1 }]],
    },
  ];

  describe.each(endpoints)(
    '$method $path ($name)',
    ({ method, path, service, valids, invalids }) => {
      it.each(valids)('%sならサービスに渡る', async (_, body) => {
        const res = await request(app.getHttpServer())[method](path).send(body);
        expect(res.status).toBeLessThan(300);
        expect(englishService[service]).toHaveBeenCalledWith(body);
      });

      it.each(invalids)('%sなら400でサービスを呼ばない', async (_, body) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .send(body as object)
          .expect(400);
        expect(typeof res.body.message).toBe('string');
        expect(englishService[service]).not.toHaveBeenCalled();
      });
    },
  );

  describe('POST /english/source/words (出典に単語を一括登録・バッチ用)', () => {
    it('バッチが送る文字列の出典IDは数値にしてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/english/source/words')
        .send({ sourceId: '3', words: ['apple', 'banana'] })
        .expect(201);
      expect(englishService.registerWordsToSource).toHaveBeenCalledWith(3, [
        'apple',
        'banana',
      ]);
    });

    it.each([
      ['出典IDが数値でない', { sourceId: 'abc', words: ['apple'] }],
      ['出典IDが空', { sourceId: '', words: ['apple'] }],
      ['出典IDが0', { sourceId: '0', words: ['apple'] }],
      ['wordsが配列でない', { sourceId: '3', words: 'apple' }],
      ['wordsがない', { sourceId: '3' }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .post('/english/source/words')
        .send(body)
        .expect(400);
      expect(englishService.registerWordsToSource).not.toHaveBeenCalled();
    });
  });

  describe('GET /english/example/test (例文テストデータ取得)', () => {
    it.each([
      ['出典が未指定なら全出典', '', undefined],
      // プルダウンで「選択なし」を選ぶと-1が送られる
      ['出典が-1(選択なし)なら全出典', '?sourceId=-1', undefined],
      ['出典を指定', '?sourceId=3', 3],
    ])('%s', async (_, query, sourceId) => {
      await request(app.getHttpServer())
        .get('/english/example/test' + query)
        .expect(200);
      expect(englishService.getExampleTestService).toHaveBeenCalledWith(
        sourceId,
      );
    });

    it('出典IDが数値でなければ400', async () => {
      await request(app.getHttpServer())
        .get('/english/example/test?sourceId=abc')
        .expect(400);
      expect(englishService.getExampleTestService).not.toHaveBeenCalled();
    });
  });

  describe('名前の前後の空白(全角を含む)', () => {
    it('例文追加では、前後の空白を除いてサービスに渡し、空白だけの単語名は紐付けない扱いになる', async () => {
      await request(app.getHttpServer())
        .post('/english/example')
        .send({
          exampleEn: ' I eat. ',
          exampleJa: '\u3000食べる',
          wordName: '\u3000',
          sourceId: -2,
          newSourceName: ' 洋書 ',
        })
        .expect(201);
      expect(englishService.addExampleService).toHaveBeenCalledWith({
        exampleEn: 'I eat.',
        exampleJa: '食べる',
        wordName: '',
        sourceId: -2,
        newSourceName: '洋書',
      });
    });

    it.each([
      ['英文が空白だけ', { exampleEn: ' ', exampleJa: '食べる' }],
      ['和文が空白だけ', { exampleEn: 'I eat.', exampleJa: '\u3000' }],
      [
        '出典がその他(-2)で出典名が空白だけ',
        {
          exampleEn: 'I eat.',
          exampleJa: '食べる',
          sourceId: -2,
          newSourceName: ' ',
        },
      ],
    ])('例文追加で%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .post('/english/example')
        .send(body)
        .expect(400);
      expect(englishService.addExampleService).not.toHaveBeenCalled();
    });
  });
});
