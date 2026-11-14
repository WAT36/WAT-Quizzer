import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { EnglishWordController } from './word.controller';
import { EnglishWordService } from './word.service';
import { EnglishWordTestService } from './test/test.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('EnglishWordController', () => {
  let app: INestApplication;
  const wordService = {
    addWordAndMeanService: jest.fn(),
    wordTestClearedService: jest.fn(),
    wordTestFailedService: jest.fn(),
    upsertSourceOfWordById: jest.fn(),
    deleteSourceOfWordById: jest.fn(),
    upsertSubSourceOfWordById: jest.fn(),
    deleteSubSourceOfWordById: jest.fn(),
    deleteMeandById: jest.fn(),
    addSynonymService: jest.fn(),
    addAntonymService: jest.fn(),
    addDerivativeService: jest.fn(),
    addEtymologyService: jest.fn(),
    linkWordEtymologyService: jest.fn(),
    toggleCheckService: jest.fn(),
    editWordMeanService: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EnglishWordController],
      providers: [
        { provide: EnglishWordService, useValue: wordService },
        { provide: EnglishWordTestService, useValue: {} },
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
    Object.values(wordService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({});
    });
  });

  // 英単語追加で画面から送られる形（出典・品詞はプルダウンで選択）
  const addWordBody = (
    inputWord: object = {},
    mean: object = {},
  ): Record<string, unknown> => ({
    inputWord: {
      wordName: 'apple',
      sourceId: 1,
      subSourceName: '',
      ...inputWord,
    },
    pronounce: '',
    meanArrayData: [{ partOfSpeechId: 1, meaning: 'りんご', ...mean }],
  });

  type Method = 'post' | 'patch' | 'delete';
  const endpoints: {
    name: string;
    method: Method;
    path: string;
    service: keyof typeof wordService;
    valids: [string, object][];
    invalids: [string, unknown][];
  }[] = [
    {
      name: '英単語追加',
      method: 'post',
      path: '/english/word',
      service: 'addWordAndMeanService',
      valids: [
        ['出典・品詞を選択', addWordBody()],
        ['出典が選択なし(-1)', addWordBody({ sourceId: -1 })],
        [
          '出典・品詞がその他(-2)で名前を入力',
          addWordBody(
            { sourceId: -2, newSourceName: '新しい出典' },
            { partOfSpeechId: -2, partOfSpeechName: '新しい品詞' },
          ),
        ],
      ],
      invalids: [
        ['単語名が空', addWordBody({ wordName: '' })],
        ['出典IDが-3', addWordBody({ sourceId: -3 })],
        ['出典がその他(-2)で名前がない', addWordBody({ sourceId: -2 })],
        ['品詞が選択なし(-1)', addWordBody({}, { partOfSpeechId: -1 })],
        [
          '品詞がその他(-2)で名前がない',
          addWordBody({}, { partOfSpeechId: -2 }),
        ],
        ['意味が空', addWordBody({}, { meaning: '' })],
        ['meanArrayDataがない', { inputWord: addWordBody().inputWord }],
      ],
    },
    {
      name: 'テスト正解登録',
      method: 'post',
      path: '/english/word/test/clear',
      service: 'wordTestClearedService',
      valids: [
        ['単語名テスト(0)', { wordId: 1, testType: 0 }],
        ['意味当てテスト(2)', { wordId: 1, testType: 2 }],
      ],
      invalids: [
        ['testTypeが定義外(3)', { wordId: 1, testType: 3 }],
        ['testTypeがない', { wordId: 1 }],
        ['wordIdが文字列', { wordId: '1', testType: 0 }],
      ],
    },
    {
      name: 'テスト不正解登録',
      method: 'post',
      path: '/english/word/test/fail',
      service: 'wordTestFailedService',
      valids: [['四択テスト(1)', { wordId: 1, testType: 1 }]],
      invalids: [['testTypeが-1', { wordId: 1, testType: -1 }]],
    },
    {
      name: '出典追加・更新',
      method: 'post',
      path: '/english/word/source',
      service: 'upsertSourceOfWordById',
      valids: [
        ['更新', { id: 3, wordId: 1, sourceId: 2 }],
        ['新規追加(id=-1)', { id: -1, wordId: 1, sourceId: 2 }],
      ],
      invalids: [
        ['idが-2', { id: -2, wordId: 1, sourceId: 2 }],
        ['出典が選択なし(-1)', { id: -1, wordId: 1, sourceId: -1 }],
      ],
    },
    {
      name: '出典削除',
      method: 'delete',
      path: '/english/word/source',
      service: 'deleteSourceOfWordById',
      valids: [['削除', { id: 3 }]],
      invalids: [
        ['idがない', {}],
        ['idが-1(未登録)', { id: -1 }],
      ],
    },
    {
      name: 'サブ出典追加・更新',
      method: 'post',
      path: '/english/word/subsource',
      service: 'upsertSubSourceOfWordById',
      valids: [
        ['更新', { id: 3, wordId: 1, subSource: 'p.10' }],
        ['新規追加(id=-1)', { id: -1, wordId: 1, subSource: 'p.10' }],
      ],
      invalids: [['サブ出典が空', { id: -1, wordId: 1, subSource: '' }]],
    },
    {
      name: 'サブ出典削除',
      method: 'delete',
      path: '/english/word/subsource',
      service: 'deleteSubSourceOfWordById',
      valids: [['削除', { id: 3 }]],
      invalids: [['idが文字列', { id: '3' }]],
    },
    {
      name: '意味削除',
      method: 'delete',
      path: '/english/word/mean',
      service: 'deleteMeandById',
      valids: [['削除', { meanId: 5 }]],
      invalids: [['meanIdが-1(未登録)', { meanId: -1 }]],
    },
    {
      name: '類義語追加',
      method: 'post',
      path: '/english/word/synonym',
      service: 'addSynonymService',
      valids: [['追加', { wordId: 1, synonymWordName: 'fruit' }]],
      invalids: [
        ['類義語が空', { wordId: 1, synonymWordName: '' }],
        ['wordIdがない', { synonymWordName: 'fruit' }],
      ],
    },
    {
      name: '対義語追加',
      method: 'post',
      path: '/english/word/antonym',
      service: 'addAntonymService',
      valids: [['追加', { wordId: 1, antonymWordName: 'small' }]],
      invalids: [['対義語が空', { wordId: 1, antonymWordName: '' }]],
    },
    {
      name: '派生語追加',
      method: 'post',
      path: '/english/word/derivative',
      service: 'addDerivativeService',
      valids: [['追加', { wordName: 'happy', derivativeName: 'happiness' }]],
      invalids: [
        ['派生語が空', { wordName: 'happy', derivativeName: '' }],
        ['元単語がない', { derivativeName: 'happiness' }],
      ],
    },
    {
      name: '語源追加',
      method: 'post',
      path: '/english/word/etymology',
      service: 'addEtymologyService',
      valids: [['追加', { etymologyName: 'bio' }]],
      invalids: [['語源名が空', { etymologyName: '' }]],
    },
    {
      name: '単語-語源紐付け',
      method: 'post',
      path: '/english/word/etymology/link',
      service: 'linkWordEtymologyService',
      valids: [['紐付け', { etymologyName: 'bio', wordId: 1 }]],
      invalids: [['wordIdが-1', { etymologyName: 'bio', wordId: -1 }]],
    },
    {
      name: '単語チェック反転',
      method: 'post',
      path: '/english/word/check/toggle',
      service: 'toggleCheckService',
      valids: [['反転', { wordId: 1 }]],
      invalids: [['wordIdがない', {}]],
    },
    {
      name: '意味編集・追加',
      method: 'patch',
      path: '/english/word/1',
      service: 'editWordMeanService',
      valids: [
        [
          '編集',
          {
            wordId: 1,
            wordMeanId: 2,
            meanId: 5,
            partofspeechId: 1,
            meaning: 'りんご',
          },
        ],
        [
          '意味がない単語に新規追加(wordMeanId=0, meanId=-1)',
          {
            wordId: 1,
            wordMeanId: 0,
            meanId: -1,
            partofspeechId: 1,
            meaning: 'りんご',
          },
        ],
      ],
      invalids: [
        [
          '品詞が選択なし(-1)',
          {
            wordId: 1,
            wordMeanId: 2,
            meanId: 5,
            partofspeechId: -1,
            meaning: 'りんご',
          },
        ],
        [
          'wordMeanIdが-1',
          {
            wordId: 1,
            wordMeanId: -1,
            meanId: -1,
            partofspeechId: 1,
            meaning: 'りんご',
          },
        ],
      ],
    },
  ];

  describe.each(endpoints)(
    '$method $path ($name)',
    ({ method, path, service, valids, invalids }) => {
      it.each(valids)('%sならサービスに渡る', async (_, body) => {
        const res = await request(app.getHttpServer())[method](path).send(body);
        expect(res.status).toBeLessThan(300);
        expect(wordService[service]).toHaveBeenCalledWith(body);
      });

      it.each(invalids)('%sなら400でサービスを呼ばない', async (_, body) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .send(body as object)
          .expect(400);
        expect(typeof res.body.message).toBe('string');
        expect(wordService[service]).not.toHaveBeenCalled();
      });
    },
  );

  it('英単語追加で出典がその他なのに名前がなければ、入力を促すメッセージで400', async () => {
    const res = await request(app.getHttpServer())
      .post('/english/word')
      .send(addWordBody({ sourceId: -2 }))
      .expect(400);
    expect(res.body.message).toBe(
      'inputWord.newSourceName: 新規追加する出典を入力してください',
    );
  });
});
