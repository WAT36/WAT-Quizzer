import { ExecutionContext, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('TodoController', () => {
  let app: INestApplication;
  const service = {
    addTodoService: jest.fn(),
    addTodoDiaryService: jest.fn(),
    saveTodoCheckStatusService: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        { provide: TodoService, useValue: service },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
      ],
    })
      .overrideGuard(CognitoAuthGuard)
      .useValue({
        // 認証済みのユーザー(Cognitoのsub)をリクエストに付ける
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = { sub: 'user-1' };
          return true;
        },
      })
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

  describe('POST /todo (Todo追加)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .post('/todo')
        .send({ todo: '掃除' })
        .expect(201);
      expect(service.addTodoService).toHaveBeenCalledWith('掃除');
    });

    it.each([
      ['Todoが空', { todo: '' }],
      ['Todoがない', {}],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer()).post('/todo').send(body).expect(400);
      expect(service.addTodoService).not.toHaveBeenCalled();
    });
  });

  describe('POST /todo/diary (Todo日記追加)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .post('/todo/diary')
        .send({ date: '2026-11-14' })
        .expect(201);
      expect(service.addTodoDiaryService).toHaveBeenCalledWith('2026-11-14');
    });

    it.each([
      ['2026/11/14', '日付はYYYY-MM-DD形式で入力してください'],
      ['2026-13-01', '有効な日付を入力してください'],
      ['2026-02-30', '有効な日付を入力してください'],
    ])('日付が%sなら「%s」で400', async (date, message) => {
      const res = await request(app.getHttpServer())
        .post('/todo/diary')
        .send({ date })
        .expect(400);
      expect(res.body.message).toBe(`date: ${message}`);
      expect(service.addTodoDiaryService).not.toHaveBeenCalled();
    });

    it('日付がなければ400', async () => {
      await request(app.getHttpServer())
        .post('/todo/diary')
        .send({})
        .expect(400);
      expect(service.addTodoDiaryService).not.toHaveBeenCalled();
    });
  });

  describe('PUT /todo/check-status (Todoチェック状態保存)', () => {
    it.each([
      ['完了したTodoあり', [1, 3]],
      ['全部未完了(空配列)', []],
    ])('%sならサービスに渡る', async (_, completedTodoIds) => {
      await request(app.getHttpServer())
        .put('/todo/check-status')
        .send({ date: '2026-11-14', completedTodoIds })
        .expect(200);
      expect(service.saveTodoCheckStatusService).toHaveBeenCalledWith(
        'user-1',
        '2026-11-14',
        completedTodoIds,
      );
    });

    it.each([
      ['日付の形式が違う', { date: '20261114', completedTodoIds: [1] }],
      ['IDに文字列', { date: '2026-11-14', completedTodoIds: ['1'] }],
      ['completedTodoIdsがない', { date: '2026-11-14' }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .put('/todo/check-status')
        .send(body)
        .expect(400);
      expect(service.saveTodoCheckStatusService).not.toHaveBeenCalled();
    });
  });

  describe('Todoの前後の空白(全角を含む)', () => {
    it('前後の空白を除いてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/todo')
        .send({ todo: ' 単語を覚える\u3000' })
        .expect(201);
      expect(service.addTodoService).toHaveBeenCalledWith('単語を覚える');
    });

    it('空白だけなら400でサービスを呼ばない', async () => {
      await request(app.getHttpServer())
        .post('/todo')
        .send({ todo: '\u3000 ' })
        .expect(400);
      expect(service.addTodoService).not.toHaveBeenCalled();
    });
  });
});
