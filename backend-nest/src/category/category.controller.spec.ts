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
});
