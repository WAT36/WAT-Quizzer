import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AllExceptionsFilter } from 'src/common/filter/allExceptions.filter';

// コントローラーでのリクエストの検証を確認する（サービスはモック、認証は通す）
describe('CategoryController', () => {
  let app: INestApplication;
  const service = {
    addCategoryParentChild: jest.fn(),
    deleteCategoryParentChild: jest.fn(),
    getAccuracyRateByCategory: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: service },
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

  describe('POST /category/parent-child (カテゴリ親子関係追加)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .post('/category/parent-child')
        .send({ file_num: 1, parent_category: '親', child_category: '子' })
        .expect(201);
      expect(service.addCategoryParentChild).toHaveBeenCalledWith(
        1,
        '親',
        '子',
      );
    });

    it.each([
      ['file_numがない', { parent_category: '親', child_category: '子' }],
      [
        '子カテゴリが空',
        { file_num: 1, parent_category: '親', child_category: '' },
      ],
      [
        '親と子が同じカテゴリ',
        { file_num: 1, parent_category: '親', child_category: '親' },
      ],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      const res = await request(app.getHttpServer())
        .post('/category/parent-child')
        .send(body)
        .expect(400);
      expect(typeof res.body.message).toBe('string');
      expect(service.addCategoryParentChild).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /category/parent-child (カテゴリ親子関係削除)', () => {
    it('画面から送られる形のデータはサービスに渡る', async () => {
      await request(app.getHttpServer())
        .delete('/category/parent-child')
        .send({ id: 5 })
        .expect(200);
      expect(service.deleteCategoryParentChild).toHaveBeenCalledWith(5);
    });

    it.each([
      ['idがない', {}],
      ['idが文字列', { id: '5' }],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .delete('/category/parent-child')
        .send(body)
        .expect(400);
      expect(service.deleteCategoryParentChild).not.toHaveBeenCalled();
    });
  });

  describe('GET /category/rate (カテゴリ別正答率)', () => {
    it('ファイルだけ指定', async () => {
      await request(app.getHttpServer())
        .get('/category/rate?file_num=2')
        .expect(200);
      expect(service.getAccuracyRateByCategory).toHaveBeenCalledWith(
        2,
        undefined,
        undefined,
        undefined,
      );
    });

    it('期間と問題形式を指定すると、日付はDate・形式IDは配列にして渡す', async () => {
      await request(app.getHttpServer())
        .get(
          '/category/rate?file_num=2&startDate=2026-11-01&endDate=2026-11-14&format_id=1,3',
        )
        .expect(200);
      expect(service.getAccuracyRateByCategory).toHaveBeenCalledWith(
        2,
        new Date('2026-11-01'),
        new Date('2026-11-14'),
        [1, 3],
      );
    });

    it.each([
      ['file_numがない', ''],
      ['file_numが数値でない', '?file_num=abc'],
      ['日付の形式が違う', '?file_num=2&startDate=2026/11/01'],
      ['存在しない日付', '?file_num=2&endDate=2026-02-30'],
      [
        '開始日が終了日より後',
        '?file_num=2&startDate=2026-11-15&endDate=2026-11-14',
      ],
      ['問題形式IDが数値でない', '?file_num=2&format_id=1,abc'],
    ])('%sなら400でサービスを呼ばない', async (_, query) => {
      await request(app.getHttpServer())
        .get('/category/rate' + query)
        .expect(400);
      expect(service.getAccuracyRateByCategory).not.toHaveBeenCalled();
    });
  });

  describe('カテゴリ親子関係のカテゴリ名の前後の空白(全角を含む)', () => {
    it('前後の空白を除いてサービスに渡す', async () => {
      await request(app.getHttpServer())
        .post('/category/parent-child')
        .send({
          file_num: 1,
          parent_category: ' 親 ',
          child_category: '子\u3000',
        })
        .expect(201);
      expect(service.addCategoryParentChild).toHaveBeenCalledWith(
        1,
        '親',
        '子',
      );
    });

    it.each([
      [
        '親カテゴリが空白だけ',
        { file_num: 1, parent_category: ' ', child_category: '子' },
      ],
      [
        '空白を除くと親と子が同じ',
        { file_num: 1, parent_category: ' 親', child_category: '親\u3000' },
      ],
    ])('%sなら400でサービスを呼ばない', async (_, body) => {
      await request(app.getHttpServer())
        .post('/category/parent-child')
        .send(body)
        .expect(400);
      expect(service.addCategoryParentChild).not.toHaveBeenCalled();
    });
  });
});
