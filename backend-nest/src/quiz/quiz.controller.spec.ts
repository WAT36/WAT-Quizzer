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
  const quizService = { add: jest.fn() };

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
    quizService.add.mockReset();
    quizService.add.mockResolvedValue({ id: 1 });
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
});
