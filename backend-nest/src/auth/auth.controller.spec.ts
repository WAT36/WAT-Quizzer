import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック）
describe('AuthController', () => {
  let app: INestApplication;
  const authService = {
    signIn: jest.fn(),
    completeNewPassword: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    Object.values(authService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({ status: 'SUCCESS', accessToken: 'access' });
    });
  });

  describe('POST /auth/signin (サインイン)', () => {
    it('ユーザー名とパスワードはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'user', password: 'pass' })
        .expect(200);
      expect(authService.signIn).toHaveBeenCalledWith('user', 'pass');
    });

    it.each([
      ['ユーザー名が空', { username: '', password: 'pass' }],
      ['パスワードがない', { username: 'user' }],
      // バッチで環境変数が未設定の場合
      ['ユーザー名・パスワードがない', {}],
      ['パスワードが数値', { username: 'user', password: 12345 }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(body)
        .expect(400);
      expect(typeof res.body.message).toBe('string');
      expect(authService.signIn).not.toHaveBeenCalled();
    });

    it('400のmessageに送ったパスワードの値を含めない', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: '', password: 98765 })
        .expect(400);
      expect(res.body.message).not.toContain('98765');
    });
  });

  describe('POST /auth/newpassword (新しいパスワードの設定)', () => {
    it('ユーザー名・新パスワード・sessionはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .post('/auth/newpassword')
        .send({ username: 'user', password: 'newpass', session: 'sess' })
        .expect(200);
      expect(authService.completeNewPassword).toHaveBeenCalledWith(
        'user',
        'newpass',
        'sess',
      );
    });

    it.each([
      ['sessionがない', { username: 'user', password: 'newpass' }],
      ['sessionが空', { username: 'user', password: 'newpass', session: '' }],
      ['新パスワードが空', { username: 'user', password: '', session: 'sess' }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .post('/auth/newpassword')
        .send(body)
        .expect(400);
      expect(authService.completeNewPassword).not.toHaveBeenCalled();
    });
  });
});
