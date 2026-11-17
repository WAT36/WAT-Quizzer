import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { SayingController } from './saying.controller';
import { SayingService } from './saying.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('SayingController', () => {
  let app: INestApplication;
  const service = {
    addBookService: jest.fn(),
    addSayingService: jest.fn(),
    editSayingService: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SayingController],
      providers: [
        { provide: SayingService, useValue: service },
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
    Object.values(service).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({});
    });
  });

  type Method = 'post' | 'patch';
  const endpoints: {
    name: string;
    method: Method;
    path: string;
    service: keyof typeof service;
    // 名前, 送るデータ, サービスが受け取るデータ
    valids: [string, object, object][];
    invalids: [string, object][];
  }[] = [
    {
      name: '啓発本追加',
      method: 'post',
      path: '/saying/book',
      service: 'addBookService',
      valids: [['本の名前を入力', { book_name: '本' }, { book_name: '本' }]],
      invalids: [
        ['本の名前が空', { book_name: '' }],
        ['本の名前が257文字', { book_name: 'あ'.repeat(257) }],
      ],
    },
    {
      name: '格言追加',
      method: 'post',
      path: '/saying',
      service: 'addSayingService',
      valids: [
        [
          '説明は空',
          { book_id: 1, saying: '格言', explanation: '' },
          { book_id: 1, saying: '格言', explanation: '' },
        ],
      ],
      invalids: [
        ['本が未選択(-1)', { book_id: -1, saying: '格言', explanation: '' }],
        ['格言が空', { book_id: 1, saying: '', explanation: '' }],
        ['説明がない', { book_id: 1, saying: '格言' }],
      ],
    },
    {
      name: '格言編集',
      method: 'patch',
      path: '/saying',
      service: 'editSayingService',
      valids: [
        [
          // 格言取得APIの結果をそのまま編集画面に入れるので、余分な項目も送られてくる
          '取得した格言を編集',
          { id: 3, saying: '格言', explanation: '説明', book_id: 1 },
          { id: 3, saying: '格言', explanation: '説明' },
        ],
      ],
      invalids: [
        ['格言を取得していない(id=-1)', { id: -1, saying: '格言' }],
        ['格言が空', { id: 3, saying: '' }],
      ],
    },
  ];

  describe.each(endpoints)(
    '$method $path ($name)',
    ({ method, path, service: name, valids, invalids }) => {
      it.each(valids)('%sならサービスに渡る', async (_, body, expected) => {
        const res = await request(app.getHttpServer())[method](path).send(body);
        expect(res.status).toBeLessThan(300);
        expect(service[name]).toHaveBeenCalledWith(expected);
      });

      it.each(invalids)('%sなら400でサービスを呼ばない', async (_, body) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .send(body)
          .expect(400);
        expect(typeof res.body.message).toBe('string');
        expect(service[name]).not.toHaveBeenCalled();
      });
    },
  );

  describe('前後の空白(全角を含む)', () => {
    it('格言は前後の空白を除いてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/saying')
        .send({ book_id: 1, saying: ' 継続は力なり\u3000', explanation: '' })
        .expect(201);
      expect(service.addSayingService).toHaveBeenCalledWith({
        book_id: 1,
        saying: '継続は力なり',
        explanation: '',
      });
    });

    it.each([
      [
        '格言が空白だけ',
        '/saying',
        { book_id: 1, saying: '\u3000', explanation: '' },
      ],
      ['本の名前が空白だけ', '/saying/book', { book_name: '  ' }],
    ])('%sなら400', async (_, path, body) => {
      await request(app.getHttpServer()).post(path).send(body).expect(400);
      expect(service.addSayingService).not.toHaveBeenCalled();
      expect(service.addBookService).not.toHaveBeenCalled();
    });
  });
});
