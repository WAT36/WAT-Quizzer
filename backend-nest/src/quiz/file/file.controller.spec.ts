import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuizFileController } from './file.controller';
import { QuizFileService } from './file.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('QuizFileController', () => {
  let app: INestApplication;
  const quizFileService = {
    addFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QuizFileController],
      providers: [
        { provide: QuizFileService, useValue: quizFileService },
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
    Object.values(quizFileService).forEach((fn) => {
      fn.mockReset();
      fn.mockResolvedValue({});
    });
  });

  describe('POST /quiz/file (問題ファイル追加)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      const body = { file_name: 'abcdefgh', file_nickname: '新しいファイル' };
      await request(app.getHttpServer())
        .post('/quiz/file')
        .send(body)
        .expect(201);
      expect(quizFileService.addFile).toHaveBeenCalledWith(body);
    });

    it.each([
      ['file_nicknameがない', { file_name: 'abcdefgh' }],
      ['file_nameがない', { file_nickname: 'ファイル' }],
      ['file_nicknameが数値', { file_name: 'abcdefgh', file_nickname: 1 }],
      [
        'file_nicknameが257文字',
        { file_name: 'abcdefgh', file_nickname: 'あ'.repeat(257) },
      ],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      const res = await request(app.getHttpServer())
        .post('/quiz/file')
        .send(body)
        .expect(400);
      expect(typeof res.body.message).toBe('string');
      expect(quizFileService.addFile).not.toHaveBeenCalled();
    });

    it('ファイル名が空なら、入力を促すメッセージで400', async () => {
      const res = await request(app.getHttpServer())
        .post('/quiz/file')
        .send({ file_name: 'abcdefgh', file_nickname: '' })
        .expect(400);
      expect(res.body.message).toBe(
        'file_nickname: ファイル名を入力してください',
      );
      expect(quizFileService.addFile).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /quiz/file (問題ファイル削除)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .delete('/quiz/file')
        .send({ file_id: 1 })
        .expect(200);
      expect(quizFileService.deleteFile).toHaveBeenCalledWith({ file_id: 1 });
    });

    it.each([
      ['file_idがない', {}],
      ['file_idが文字列', { file_id: '1' }],
      ['file_idが-1(未選択)', { file_id: -1 }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .delete('/quiz/file')
        .send(body)
        .expect(400);
      expect(quizFileService.deleteFile).not.toHaveBeenCalled();
    });
  });
});
