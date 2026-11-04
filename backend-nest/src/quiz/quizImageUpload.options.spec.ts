import {
  Controller,
  INestApplication,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { quizImageUploadOptions } from './quizImageUpload.options';

@Controller()
class TestUploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', quizImageUploadOptions))
  upload() {
    return { result: 'OK' };
  }
}

// multerを実際に通して、受け付ける条件を確認する
describe('quizImageUploadOptions', () => {
  let app: INestApplication;
  const MB = 1024 * 1024;
  const upload = (size: number, contentType: string) =>
    request(app.getHttpServer())
      .post('/upload')
      .attach('file', Buffer.alloc(size), {
        filename: 'test.bin',
        contentType,
      });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestUploadController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif'])(
    '%sは受け付ける',
    async (contentType) => {
      await upload(10, contentType).expect(201);
    },
  );

  it('5MBちょうどの画像は受け付ける', async () => {
    await upload(5 * MB, 'image/png').expect(201);
  });

  it('5MBを超える画像は413エラーにする', async () => {
    await upload(5 * MB + 1, 'image/png').expect(413);
  });

  it.each(['text/html', 'image/svg+xml', 'application/pdf'])(
    '%sは400エラーにする',
    async (contentType) => {
      await upload(10, contentType).expect(400);
    },
  );
});
